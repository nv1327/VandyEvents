'use client';

import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Session, User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ManageSubscriptionButton from './ManageSubscriptionButton';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
    prices: Price[];
}
interface PriceWithProduct extends Price {
    products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
    prices: PriceWithProduct | null;
}

interface Props {
    session: Session | null;
    user: User | null | undefined;
    products: ProductWithPrices[];
    subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({
    session,
    user,
    products,
    subscription
}: Props) {
    const intervals = Array.from(
        new Set(
            products.flatMap((product) =>
                product?.prices?.map((price) => price?.interval)
            )
        )
    );
    const router = useRouter();
    const [billingInterval, setBillingInterval] =
        useState<BillingInterval>('month');
    const [priceIdLoading, setPriceIdLoading] = useState<string>();

    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);
        if (!user) {
            return router.push('/signin');
        }
        if (subscription) {
            return router.push('/billing');
        }
        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price }
            });

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            return alert((error as Error)?.message);
        } finally {
            setPriceIdLoading(undefined);
        }
    };

    if (!products.length)
        return (
            <section className="bg-black">
                <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:flex-col sm:align-center"></div>
                    <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
                        No subscription pricing plans found. Create them in your{' '}
                        <a
                            className="text-pink-500 underline"
                            href="https://dashboard.stripe.com/products"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Stripe Dashboard
                        </a>
                        .
                    </p>
                </div>
            </section>
        );

    if (products.length === 1)
        return (
            <section className="bg-white text-indigo-900">
                <div className="max-w-6xl px-4 py-8 mx-auto sm:py-16 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:flex-col sm:align-center">
                        <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl">
                            Pricing Plans
                        </h1>
                        <p className="max-w-2xl m-auto mt-5 text-xl text-gray-800 sm:text-center sm:text-2xl">
                            Try Vandy Events for free, then subscribe to plan to grow your business further. Account
                            plans unlock additional features.
                        </p>
                        <div className="relative self-center mt-6 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
                            {intervals.includes('month') && (
                                <button
                                    onClick={() => setBillingInterval('month')}
                                    type="button"
                                    className={`${billingInterval === 'month'
                                        ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                                        : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                                        } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                                >
                                    Monthly billing
                                </button>
                            )}
                            {intervals.includes('year') && (
                                <button
                                    onClick={() => setBillingInterval('year')}
                                    type="button"
                                    className={`${billingInterval === 'year'
                                        ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                                        : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                                        } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                                >
                                    Yearly billing
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                        {products.map((product) => {
                            const price = product?.prices?.find(
                                (price) => price.interval === billingInterval
                            );
                            if (!price) return null;
                            const priceString = new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: price.currency!,
                                minimumFractionDigits: 0
                            }).format((price?.unit_amount || 0) / 100);
                            return (

                                <div
                                    key={product.id}
                                    className={cn(
                                        'rounded-lg',
                                        {
                                            'border border-indigo-500': subscription
                                                ? product.name === subscription?.prices?.products?.name
                                                : product.name === 'Freelancer'
                                        }
                                    )}
                                >
                                    <div className="bg-white divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="p-6">
                                            <h2 className="text-lg font-medium leading-6 text-gray-900">{product.name}</h2>
                                            <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                                            <p className="mt-4">
                                                <span className="text-4xl font-bold tracking-tight text-gray-900">{priceString}</span>
                                                <span className="text-base font-medium text-gray-500">/{billingInterval}</span>
                                            </p>
                                            <p className="mt-1">
                                                <span className="text-sm font-default tracking-tight text-gray-700 mr-2">2 articles</span>
                                                <span className="text-sm font-default tracking-tight text-gray-500">($0.00 / article)</span>
                                            </p>
                                            {session && subscription ? <ManageSubscriptionButton session={session} /> : <button className='group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 w-full hover:bg-indigo-700 focus:ring-indigo-500 mt-4' onClick={() => handleCheckout(price)}>Subscribe</button>}
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );

    return (
        <section className="bg-white text-indigo-900">
            <div className="max-w-6xl px-4 py-8 mx-auto sm:py-16 sm:px-6 lg:px-8">
                <div className="sm:flex sm:flex-col sm:align-center">
                    <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl">
                        Pricing Plans
                    </h1>
                    <p className="max-w-2xl m-auto mt-5 text-xl text-gray-800 sm:text-center sm:text-2xl">
                        Try Vandy Events for free, then subscribe to plan to grow your business further. Account
                        plans unlock additional features.
                    </p>
                    {/*
                    <div className="relative self-center mt-6 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
                        {intervals.includes('month') && (
                            <button
                                onClick={() => setBillingInterval('month')}
                                type="button"
                                className={`${billingInterval === 'month'
                                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                                    } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                            >
                                Monthly billing
                            </button>
                        )}
                        {intervals.includes('year') && (
                            <button
                                onClick={() => setBillingInterval('year')}
                                type="button"
                                className={`${billingInterval === 'year'
                                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                                    } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                            >
                                Yearly billing
                            </button>
                        )}
                    </div>
                    */}
                </div>
                {session && subscription && <ManageSubscriptionButton session={session} />}
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                    {products.map((product) => {
                        const price = product?.prices?.find(
                            (price) => price.interval === billingInterval
                        );
                        if (!price) return null;
                        const priceString = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: price.currency!,
                            minimumFractionDigits: 0
                        }).format((price?.unit_amount || 0) / 100);
                        return (

                            <div
                                key={product.id}
                                className={cn(
                                    'rounded-lg',
                                    {
                                        'border border-indigo-500': subscription
                                            ? product.name === subscription?.prices?.products?.name
                                            : product.name === 'Growth',
                                        'border border-gray-200': !(subscription
                                            ? product.name === subscription?.prices?.products?.name
                                            : product.name === 'Growth')
                                    }
                                )}
                            >
                                <div className="bg-white divide-y divide-gray-200 rounded-lg">
                                    <div className="p-6">
                                        <h2 className="text-lg font-medium leading-6 text-gray-900">{product.name}</h2>
                                        <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                                        <p className="mt-4">
                                            <span className="text-4xl font-bold tracking-tight text-gray-900">{priceString}</span>
                                            <span className="text-base font-medium text-gray-500">/{billingInterval}</span>
                                        </p>
                                        {product.name === "Hobby" ? <p className="mt-1">
                                            <span className="text-sm font-default tracking-tight text-gray-700 mr-2">2 articles</span>
                                            <span className="text-sm font-default tracking-tight text-gray-500">($0.00 / article)</span>
                                        </p> : product.name === "Growth" ? <p className="mt-1">
                                            <span className="text-sm font-default tracking-tight text-gray-700 mr-2">50 articles</span>
                                            <span className="text-sm font-default tracking-tight text-gray-500">($0.98 / article)</span>
                                        </p> : <p className="mt-1">
                                            <span className="text-sm font-default tracking-tight text-gray-700 mr-2">200 articles</span>
                                            <span className="text-sm font-default tracking-tight text-gray-500">($0.50 / article)</span>
                                        </p>}

                                        {session && subscription ? null : <button className='group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2 w-full hover:bg-indigo-700 focus:ring-indigo-500 mt-4' onClick={() => handleCheckout(price)}>Subscribe</button>}
                                    </div>
                                    <div className="px-6 pt-6 pb-8">
                                        <h3 className="text-sm font-medium text-gray-900">What's included</h3>
                                        {product.name === "Hobby" ?
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
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Article Thumbnail Image</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Keyword-based generation</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Modern integrations including Wordpress, Webflow, Shopify and more</span>
                                                </li>
                                            </ul> : product.name === "Growth" ? <ul role="list" className="mt-6 space-y-4">
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5">
                                                        </path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">50 articles a month</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Over 100 supported languages</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Article Thumbnail Image</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Keyword-based generation</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Modern integrations including Wordpress, Webflow, Shopify and more</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Customer Support</span>
                                                </li>
                                            </ul> : <ul role="list" className="mt-6 space-y-4">
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5">
                                                        </path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">200 articles a month</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Over 100 supported languages</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Article Thumbnail Image</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Keyword-based generation</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Modern integrations including Wordpress, Webflow, Shopify and more</span>
                                                </li>
                                                <li className="flex space-x-3">
                                                    <svg className="h-6 w-6 flex-shrink-0 text-green-500" x-description="Heroicon name: outline/check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Premium Customer Support</span>
                                                </li>
                                            </ul>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}