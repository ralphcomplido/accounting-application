import { Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    AdminUsersService,
    ApiResponseDto,
    LatestNotifications,
    NotificationDto,
    NotificationItem,
    PagedResponseDto,
    RouteAliasService,
    SearchNotificationsRequestDto,
} from "@core";
import { ProfileDataService } from "@core/backend-api/services/profile-data.service";
import { RequestPollingManager } from "@core/helpers";
import { ReplaySubject, combineLatest, finalize, forkJoin, map, of, switchMap, tap } from "rxjs";
import { IdentityService } from "../../services/identity.service";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  #dataService = inject(ProfileDataService);
  #identityService = inject(IdentityService);
  #adminService = inject(AdminUsersService);
  #routeAlias = inject(RouteAliasService);

  #notifications?: Array<NotificationItem>;
  #notificationsSubject = new ReplaySubject<Array<NotificationItem>>(1);
  #unreadCountSubject = new ReplaySubject<number>(1);
  #pollingManager = new RequestPollingManager(() => this.#requestLatestNotifications(), 15 * 1000);

  constructor() {
    this.#identityService
      .watchLoggedIn$()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: loggedIn => {
          if (loggedIn) {
            this.#pollingManager.startPolling();
          } else {
            this.#notifications = undefined;
            this.#notificationsSubject.next([]);
            this.#unreadCountSubject.next(0);
            this.#pollingManager.stopPolling();
          }
        },
      });
  }

  searchNotifications(searchNotificationsRequest: SearchNotificationsRequestDto) {
    return this.#dataService.searchNotifications(searchNotificationsRequest).pipe(
      tap(results => this.#unreadCountSubject.next(results.unreadCount)),
      switchMap(results =>
        this.#loadNotificationItems(results.data).pipe(map(notifications => <PagedResponseDto<NotificationItem>>{ ...results, data: notifications }))
      )
    );
  }

  watchLatest$() {
    return combineLatest([this.#notificationsSubject, this.#unreadCountSubject]).pipe(
      map(([notifications, unreadCount]) => <LatestNotifications>{ notifications, unreadCount })
    );
  }

  #requestLatestNotifications() {
    return this.searchNotifications({ sinceId: this.#notifications?.[0]?.id }).pipe(
      tap(results => {
        if (!results.data.length && this.#notifications) return;
        this.#notifications = [...results.data, ...(this.#notifications || [])];
        this.#notificationsSubject.next(this.#notifications);
      })
    );
  }

  #refreshLatestNotifications() {
    this.#pollingManager.pausePolling();
    this.searchNotifications({})
      .pipe(finalize(() => this.#pollingManager.resumePolling()))
      .subscribe({
        next: results => {
          this.#notifications = results.data;
          this.#notificationsSubject.next(this.#notifications);
        },
        error: (response: ApiResponseDto<any>) => console.error("Unable to refresh unread notifications", response.errorMessages),
      });
  }

  markAllNotificationsAsRead() {
    return this.#dataService.markAllNotificationsAsRead().pipe(tap(() => this.#refreshLatestNotifications()));
  }

  markNotificationAsRead(id: number) {
    return this.#dataService.markNotificationAsRead(id).pipe(tap(() => this.#refreshLatestNotifications()));
  }

  #loadNotificationItems(notifications: Array<NotificationDto>) {
    if (!notifications.length) return of(new Array<NotificationItem>());
    return forkJoin(notifications.map(notification => this.#loadNotificationItem(notification))).pipe(
      // Filter out any null items (e.g., if the user was deleted). In the future we may prefer to keep the nulls
      // and render them to indicate that the notification is no longer valid.
      map(notificationItems => notificationItems.filter(item => item !== null))
    );
  }

  #loadNotificationItem(notification: NotificationDto) {
    var notificationItem = <NotificationItem>{
      id: notification.id,
      timestamp: notification.timestamp,
      isUnread: notification.status === "Unread",
    };

    switch (notification.type) {
      case "AdministratorNewUserRegistration":
        return this.#adminService.getUser(notification.data.userId).pipe(
          map(user => {
            // User may have been deleted since the notification was created
            if (!user) return null;

            notificationItem.title = `New user registered: ${user.userName}`;
            notificationItem.description = "A new user registered!";
            notificationItem.icon = "pi pi-user";
            notificationItem.routerLink = this.#routeAlias.getRoute("admin-user", user.id);
            return notificationItem;
          })
        );
      default:
        throw new Error(`Unknown notification type in NotificationService: '${notification.type}'`);
    }
  }
}
