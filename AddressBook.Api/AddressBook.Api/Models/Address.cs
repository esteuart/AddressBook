using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AddressBook.Api.Models
{
    public class Address
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
    }
}