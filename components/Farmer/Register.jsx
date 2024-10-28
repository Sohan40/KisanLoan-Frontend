export default function Register() {

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-500">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl border border-none rounded-lg overflow-hidden">
        {/* Column 1 with background image on medium and large screens only */}
        <div
          className="hidden md:block bg-cover bg-center"
          style={{ backgroundImage: "url('/reg.jpg')" }}
        >
          {/* Optional: Add any content for the background column */}

          <div className="flex items-center justify-center h-full w-full">
            <div className="font-extrabold text-3xl">
              Welcome To AgroLend
            </div>
          </div>
        </div>

        {/* Column 2 with centered form */}
        <div className="flex items-center justify-center p-4 bg-white">
                    <form className="w-full">
                        <div className="text-center">
                            <h1 style={{ fontSize: "2em" }}>Registration Form</h1>
                        </div>

                        <div className="p-1">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" name="firstName" required className="block w-full mt-1 p-2 border rounded" />
                        </div>

                        <div className="p-1">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" name="lastName" required className="block w-full mt-1 p-2 border rounded" />
                        </div>

                        <div className="p-1">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" required placeholder="someone@example.com" className="block w-full mt-1 p-2 border rounded" />
                        </div>

                        <div className="p-1">
                            <label htmlFor="address">Address</label>
                            <input type="text" name="address" required placeholder="Street Address" className="block w-full mt-1 p-2 border rounded" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 p-1">
                            <div className="flex-1">
                                <label htmlFor="zip">ZIP Code</label>
                                <input type="text" name="zip" required className="block w-full mt-1 p-2 border rounded" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="state">State</label>
                                <input type="text" name="state" required className="block w-full mt-1 p-2 border rounded" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="country">Country</label>
                                <input type="text" name="country" required className="block w-full mt-1 p-2 border rounded" />
                            </div>
                        </div>

                        <div className="p-1">
                            <label htmlFor="landSize">Land Size (in acres)</label>
                            <input type="number" name="landSize" required className="block w-full mt-1 p-2 border rounded" />
                        </div>

                        <button type="submit" className="mx-auto block p-2 bg-blue-500 text-white rounded">Register</button>
                    </form>
                </div>
      </div>
    </div>
  );
}
