import { redirect } from 'next/navigation';
import {
    getSession,
    getUserDetails,
    getActiveProductsWithPrices,
    getSubscription
} from '@/app/supabase-server';
import { ReactNode } from 'react';
import Link from 'next/link';

import ManageSubscriptionButton from './ManageSubscriptionButton';
import Pricing from './PricingCards';

export default async function BillingPage() {

    const [session, userDetails, products, subscription] = await Promise.all([
        getSession(),
        getUserDetails(),
        getActiveProductsWithPrices(),
        getSubscription()
    ]);

    if (!session) {
        return redirect('/signin');
    }

    const subscriptionPrice =
        subscription &&
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: subscription?.prices?.currency!,
            minimumFractionDigits: 0
        }).format((subscription?.prices?.unit_amount || 0) / 100);

    const start_date = subscription && subscription.current_period_start ? new Date(subscription?.current_period_start) : null;
    const formattedStartDate = start_date && start_date.toLocaleDateString();

    const end_date = subscription && subscription.current_period_end ? new Date(subscription?.current_period_end) : null;
    const formattedEndDate = end_date && end_date.toLocaleDateString();

    return (
        <div>
            <div className="flex flex-col justify-center items-center pb-10">
                {/*
                <div className="flex flex-col space-y-2 xl:flex-row xl:items-center justify-between p-6 w-full bg-white rounded-lg border border-gray-200 shadow-sm w-sm">
                    <div className="flex flex-col">
                        <div className="text-gray-800 text-3xl font-semibold">Purchase on-demand articles for <span className="text-4xl font-bold">$2.50</span>
                        </div>
                        <div className="mt-2 text-gray-700 text-xl font-normal ">All features included, no commitment. On-demand Articles are always available</div>
                    </div>
                    <div className="w-full xl:w-96">
                        <div className="">
                            <div className="space-x-2">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">$2.50</span>
                                <span className="text-sm font-default tracking-tight text-gray-700">for 1 article</span>
                            </div>
                            <input className="mt-2 w-full accent-indigo-600" type="range" min="1" max="1000" value="1" />
                        </div>
                        <button type="button" className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 hover:bg-indigo-700 focus:ring-indigo-500 self-center items-center rounded-md py-2.5 mr-4 px-8 text-center w-full h-fit font-semibold text-white shadow-sm">Buy now</button>
                    </div>
                </div>
    
                <div className="border-t border-gray-200 w-full my-8">
                </div>
*/}

                <Pricing session={session}
                    user={session?.user}
                    products={products}
                    subscription={subscription}></Pricing>
                {/*
                <div className="flex items-center">
                    <span className="mr-3 text-xl cursor-pointer" id="headlessui-label-:r3:"></span>
                    <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2" id="headlessui-switch-:r4:" role="switch" type="button" aria-checked="false" data-headlessui-state="" aria-labelledby="headlessui-label-:r3: headlessui-label-:r5:">
                        <span aria-hidden="true" className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                        </span>
                    </button>
                    <span className="ml-3 text-xl cursor-pointer" id="headlessui-label-:r5:">
                        <span className="font-medium text-gray-900">Annual billing</span>
                        <span className="text-gray-500">(2 months free)</span>
                    </span>
                </div>
                <div className="space-y-4 mt-8 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
                    <div className="bg-white divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
                        <div className="p-6">
                            <h2 className="text-lg font-medium leading-6 text-gray-900">Hobby</h2>
                            <p className="mt-2 text-sm text-gray-500">Try us at no cost</p>
                            <p className="mt-4">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">$0</span>
                                <span className="text-base font-medium text-gray-500">/mo</span>
                            </p>
                            <p className="mt-1">
                                <span className="text-sm font-default tracking-tight text-gray-700 mr-2">2 articles</span>
                                <span className="text-sm font-default tracking-tight text-gray-500">($0.00 / article)</span>
                            </p>
                            <ManageSubscriptionButton session={session} />
                        </div>
                        <div className="px-6 pt-6 pb-8">
                            <h3 className="text-sm font-medium text-gray-900">What's included</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5">
                                        </path>
                                    </svg>
                                    <span className="text-sm text-gray-500">2 articles a month</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500">Over 100 supported languages</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-white divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
                        <div className="p-6">
                            <h2 className="text-lg font-medium leading-6 text-gray-900">Professional</h2>
                            <p className="mt-2 text-sm text-gray-500">Now you're a pro</p>
                            <p className="mt-4">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">$49</span>
                                <span className="text-base font-medium text-gray-500">/mo</span>
                            </p>
                            <p className="mt-1">
                                <span className="text-sm font-default tracking-tight text-gray-700 mr-2">50 articles</span>
                                <span className="text-sm font-default tracking-tight text-gray-500">($0.98 / article)</span>
                            </p>
                            <button className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 w-full hover:bg-indigo-700 focus:ring-indigo-500 mt-4">Choose Plan</button>
                        </div>
                        <div className="px-6 pt-6 pb-8">
                            <h3 className="text-sm font-medium text-gray-900">What's included</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500">50 articles a month</span></li>
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500">API Access</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500">Over 100 supported languages</span></li>
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500">Customer Support</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-white divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
                        <div className="p-6">
                            <h2 className="text-lg font-medium leading-6 text-gray-900">Custom</h2>
                            <p className="mt-2">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">$100</span>
                                <span className="text-base font-medium text-gray-500">/mo</span>
                                <p className="mt-1">
                                    <span className="text-sm font-default tracking-tight text-gray-700 mr-2">200 articles</span>
                                    <span className="text-sm font-default tracking-tight text-gray-500">(0.500/article)</span>
                                </p>
                                <input step="100" className="mt-2 w-full accent-indigo-600" type="range" min="200" max="10000" value="200" />
                            </p>
                            <button className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 w-full hover:bg-indigo-700 focus:ring-indigo-500 mt-4">Choose Plan</button>
                        </div>
                        <div className="px-6 pt-6 pb-8">
                            <h3 className="text-sm font-medium text-gray-900">What's included</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500">Custom # of articles a month</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500">API Access</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500">Over 100 supported languages</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5">
                                        </path>
                                    </svg>
                                    <span className="text-sm text-gray-500">Premium Customer Support</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
*/}
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="bg-gray-50 rounded-t-lg px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Billing Cycle and Plan Information</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm text-gray-500">Billing Plan</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 first-letter:uppercase">{subscription?.prices?.products?.name}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm text-gray-500">Billing Cycle Starts</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{formattedStartDate}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm text-gray-500">Billing Cycle Ends</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{formattedEndDate}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm text-gray-500 capitalize">Available Reserved Keywords</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{subscription?.available_recurring_keywords}</dd>
                        </div>
                        {/*
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm text-gray-500 capitalize">Available On-demand Keywords</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{subscription?.available_one_time_keywords}</dd>
                        </div>
                            */}
                    </dl>
                </div>
            </div>
        </div>
    );
}

interface Props {
    title: string;
    description?: string;
    footer?: ReactNode;
    children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
    return (
        <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
            <div className="px-5 py-4">
                <h3 className="mb-1 text-2xl font-medium">{title}</h3>
                <p className="text-zinc-300">{description}</p>
                {children}
            </div>
            <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
                {footer}
            </div>
        </div>
    );
}