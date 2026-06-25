const TransferForm = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="w-full lg:full mt-6 pl-0 lg:pl-2">
      
      <div className="leading-loose text-left">
        <form  onSubmit={handleSubmit}>
          <div className='flex flex-col justify-start '>
            <label htmlFor="cus_name" className="block text-sm text-gray-600">Name</label>
            <input id="cus_name" name="cus_name" type="text" required placeholder="Your Name" aria-label="Name" className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" />
          </div>
          <div className="mt-2">
            <label htmlFor="cus_email" className="block text-sm text-gray-600">Email</label>
            <input id="cus_email" name="cus_email" type="text" required placeholder="Your Email" aria-label="Email" className="w-full px-5  py-4 text-gray-700 bg-gray-200 rounded" />
          </div>
          <div className="mt-2">
            <label htmlFor="cus_address" className="block text-sm text-gray-600">Address</label>
            <input id="cus_address" name="cus_address" type="text" required placeholder="Street" aria-label="Address" className="w-full px-2 py-2 text-gray-700 bg-gray-200 rounded" />
          </div>
          
          <div className="mt-6">
            <button type="submit" className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded">$3.00</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferForm;
