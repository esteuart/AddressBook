using AddressBook.Api.Models;
using System;
using System.Collections.Concurrent;
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
        private static ConcurrentDictionary<int, Address> _addressCache = new ConcurrentDictionary<int, Address>();
        private static int nextId = 0;
        static AddressController()
        {
            int id = System.Threading.Interlocked.Increment(ref nextId);
            _addressCache.TryAdd(id, new Address {
                Id = id,
                Name = "Bob Barker",
                Line1 = "123 State St",
                City = "Los Angeles",
                State = "CA",
                Zip = "90210",
                Phone = "800-515-9787"
            });
        }

        public IEnumerable<Address> Get()
        {
            return _addressCache.Values;
        }

        public Address Get(int id)
        {
            return _addressCache[id];
        }

        public Address Post([FromBody]Address value)
        {
            if (value.Id == 0) {
                value.Id = System.Threading.Interlocked.Increment(ref nextId);
            }
            return _addressCache.AddOrUpdate(value.Id, value, (id, addr) => value);
        }

        //This does a delete. Since I couldn't get the DELETE verb to work, I did a work-around.
        public void Post(int id)
        {
            _addressCache.TryRemove(id, out Address value);
        }
    }
}
