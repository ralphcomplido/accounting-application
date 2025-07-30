﻿namespace LightNap.Core.Configuration
{
    /// <summary>
    /// Contains constant values used in the configuration of the core library.
    /// </summary>
    public static class Constants
    {
        /// <summary>
        /// Contains constant values related to the Identity service.
        /// </summary>
        internal static class Identity
        {
            /// <summary>
            /// The purpose string used to create and validate magic link tokens.
            /// </summary>
            public const string MagicLinkTokenPurpose = "MagicLink";
        }

        /// <summary>
        /// Role names used in the application.
        /// </summary>
        public static class Roles
        {
            /// <summary>
            /// The name of the administrator role.
            /// </summary>
            public const string Administrator = "Administrator";
        }

        /// <summary>
        /// Claim types used in the application.
        /// </summary>
        public static class Claims
        {
        }

        /// <summary>
        /// Contains constant values related to DTO lengths.
        /// </summary>
        internal static class Dto
        {
            public const int MaxLoginLength = 256;
            public const int MaxPasswordLength = 256;
            public const int MaxDeviceDetailsLength = 512;
            public const int MaxPasswordResetTokenLength = 512;
            public const int MaxUserNameLength = 32;
            public const int MaxVerificationCodeLength = 512;
        }

        /// <summary>
        /// Contains constant values related to cookies.
        /// </summary>
        internal class Cookies
        {
            /// <summary>
            /// The name of the refresh token cookie.
            /// </summary>
            public const string RefreshToken = "refreshToken";

            /// <summary>
            /// The "Max-Age" string used in cookies.
            /// </summary>
            public const string MaxAge = "Max-Age";

            /// <summary>
            /// The "Expires" string used in cookies.
            /// </summary>
            public const string Expires = "Expires";
        }

        /// <summary>
        /// Contains constant values related to refresh tokens.
        /// </summary>
        internal class RefreshTokens
        {
            public const string NoIpProvided = "No IP Provided";
        }
    }
}
