'use client';

import { useEffect, useState } from 'react';
import { supabase, Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Truck, Shield, Star, Loader2 } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          // Refresh products when changes occur
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('Products fetched successfully:', data?.length || 0, 'products');
      if (data && data.length > 0) {
        console.log('Sample product:', data[0]);
      }
      setProducts(data || []);
    } catch (error) {
      console.error('Exception fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products;
  
  const inStockCount = products.filter(p => p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-16 py-8">
            {/* Hero Section */}
      <section className="relative py-20 sm:py-32 container-page">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-[rgb(var(--primary))]/10 via-[rgb(var(--accent))]/5 to-transparent" />                    
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            Welcome to{' '}
            <span className="text-[rgb(var(--primary))]">Raghuvir Enterprises</span>
          </h1>
          <p className="text-xl sm:text-2xl text-[rgb(var(--muted))] max-w-2xl mx-auto">
            Discover quality products at unbeatable prices. Shop with confidence, whether you&apos;re a retailer or dealer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#products">
              <Button intent="primary" size="lg">
                Shop Now
              </Button>
            </Link>
            <Link href="/signup">
              <Button intent="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="space-y-8 container-page">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Our Products
          </h2>
          <p className="text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
            Browse through our curated collection of high-quality products
          </p>
          {!loading && products.length > 0 && (
            <p className="text-sm text-[rgb(var(--muted))]">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'} • 
              {inStockCount > 0 && ` ${inStockCount} in stock`}
              {outOfStockCount > 0 && ` • ${outOfStockCount} out of stock`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[rgb(var(--primary))]" />
            <p className="text-lg text-[rgb(var(--muted))]">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-20">
            <CardHeader>
              <div className="text-6xl mb-4">📦</div>
              <CardTitle>No Products Yet</CardTitle>
              <CardDescription>Check back soon for exciting products!</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button intent="primary">Admin Panel</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products.length > 0 && filteredProducts.length === 0 && (
              <Card className="max-w-md mx-auto text-center py-12">
                <CardHeader>
                  <CardTitle>No Products Match Filter</CardTitle>
                  <CardDescription>
                    Try changing the filter to see more products
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">Why Choose Us</h2>
          <p className="text-lg text-[rgb(var(--muted))]">We provide the best shopping experience</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Truck className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--primary))]" />
              <CardTitle>Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quick and reliable shipping to your doorstep
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--primary))]" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Safe and encrypted payment processing
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Star className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--primary))]" />
              <CardTitle>Quality Guaranteed</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Premium products with quality assurance
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
