import Sidebar from "@/sidebar/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <div id='main-content' className='h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64'>
        <main>
          <div className='pt-6 px-4'>
            <div className='w-full min-h-[calc(100vh-230px)]'>
              <div className='bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8'>
                {children}
              </div>
            </div>
          </div>
        </main>
        <footer className='bg-white md:flex md:items-center md:justify-between shadow rounded-lg p-4 md:p-6 xl:p-8 my-6 mx-4'>
          <ul className='flex items-center flex-wrap mb-6 md:mb-0'>
            <li>
              <a href='#' className='text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6'>
                Terms and conditions
              </a>
            </li>
            <li>
              <a href='#' className='text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6'>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href='#' className='text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6'>
                Licensing
              </a>
            </li>
            <li>
              <a href='#' className='text-sm font-normal text-gray-500 hover:underline'>
                Contact
              </a>
            </li>
          </ul>
          <div className='text-sm font-normal text-gray-500'>© 2023 <a href='#' className='hover:underline'>Flowbite™</a>. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
}
