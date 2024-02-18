import SupabaseProvider from './supabase-provider';
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import Link from 'next/link';
import {
  getSession
} from '@/app/supabase-server';

const meta = {
  title: 'Vandy Events',
  description: 'Find events on campus with your friends.',
  cardImage: '/logo.jpg',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://vercel.com',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  url: meta.url,
  type: meta.type,
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vercel',
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage
  }
};

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: PropsWithChildren) {

  const session = await getSession();

  const user = session?.user;

  return (
    <html lang="en">
      <body className="bg-white loading">
        <SupabaseProvider>
          <main
            id="skip"
            className=""
          >
            <div className="flex h-screen overflow-scroll bg-white font-roboto">
              <div>
                <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                  <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                      <Link className="flex items-center px-4" href="/">
                        <img className="h-11 rounded-xl" src="/logo.jpg" alt="Vandy Events" />
                        <p className="text-gray-200 text-center w-full text-2xl font-normal">Vandy Events</p>
                      </Link>
                      <nav className="mt-5 flex-1 space-y-1 px-2">
                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md" href="/events">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className="text-gray-300 mr-3 flex-shrink-0 h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418">
                          </path>
                          </svg>Events
                        </a>
                        {/*
                        <a className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md" href="/tutorials">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5">
                          </path>
                          </svg>Tutorials
                          </a>
                        
                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md" href="/billing">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z">
                          </path>
                          </svg>Billing
                        </a>
                        */}
                      </nav>
                    </div>
                    <div className="flex flex-shrink-0 bg-gray-700 p-4">
                      <a className="group block w-full flex-shrink-0" href="/settings">
                        <div className="flex items-center">
                          <div>
                            <img alt="" src="/logo.jpg" width="36" height="36" decoding="async" data-nimg="1" className="inline-block h-9 w-9 rounded-full bg-gray-400" loading="lazy" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-white">{user?.email}</p>
                            <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">View profile</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col md:pl-64">
                  <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
                    <button type="button" className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open sidebar</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <main className="flex-1 justify-start content-start">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
                  {children}
                </div>
              </main>
            </div>
          </main>
        </SupabaseProvider>
      </body>
    </html>
  );
}

{/*<html lang="en">
      <body className="bg-black loading">
        <SupabaseProvider>
          <Navbar />
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
          >
            {children}
          </main>
          <Footer />
        </SupabaseProvider>
      </body>
  </html>*/}