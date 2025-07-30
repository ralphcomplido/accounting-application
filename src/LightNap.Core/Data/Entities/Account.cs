using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LightNap.Core.Data.Entities
{
    /// <summary>
    /// Represents a financial account in the system.
    /// </summary>
    public class Account
    {
        /// <summary>
        /// Primary key for the account.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Unique account number (e.g., 101-001).
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string AccountNumber { get; set; } = string.Empty;

        /// <summary>
        /// Type of account (e.g., Asset, Liability, Equity).
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string AccountType { get; set; } = string.Empty;

        /// <summary>
        /// Descriptive name for the account (e.g., Cash, Accounts Payable).
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string AccountName { get; set; } = string.Empty;

        /// <summary>
        /// Date the account was created.
        /// </summary>
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Date the account was last modified.
        /// </summary>
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
    }
}
