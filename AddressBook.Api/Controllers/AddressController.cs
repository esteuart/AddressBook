using AddressBook.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace AddressBook.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AddressController : ApiController
    {
        // GET: api/Address
        public IEnumerable<Address> Get()
        {
            return new Address[] { new Address {
                Id = 12,
                Name = "Bob Barker",
                Line1 = "123 State St",
                City = "Los Angeles",
                State = "CA",
                Zip = "90210",
                Phone = "800-515-9787"
            } };
        }

        // GET: api/Address/5
        public Address Get(int id)
        {
            throw new NotImplementedException();
        }

        // POST: api/Address
        public void Post([FromBody]Address value)
        {
        }

        // PUT: api/Address/5
        public void Put(int id, [FromBody]Address value)
        {
        }

        // DELETE: api/Address/5
        public void Delete(int id)
        {
        }
    }
}
