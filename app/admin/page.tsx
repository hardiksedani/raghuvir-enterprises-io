/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { supabase, type Product, type Order, type WebsiteItem } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

// Define a type for the item form content to avoid 'any'
type ItemContent = Record<string, unknown>;

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  // local role that can be filled from profile OR DB
  const [role, setRole] = useState<string | null>(profile?.user_role ?? null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleFetchAttempted, setRoleFetchAttempted] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'items'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [websiteItems, setWebsiteItems] = useState<WebsiteItem[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<WebsiteItem | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    image_url: '',
    retailer_price: '',
    dealer_price: '',
    min_dealer_quantity: '',
    stock: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    item_type: 'general',
    is_published: true,
    order_index: '0',
    custom_fields: '',
  });

  // sync role when profile arrives
  useEffect(() => {
    if (profile?.user_role) {
      setRole(profile.user_role);
      setRoleFetchAttempted(true);
    }
  }, [profile]);

  // fallback: fetch role by id with timeout
  useEffect(() => {
    if (!user || role || roleFetchAttempted) return;
    
    setRoleLoading(true);
    const timeoutId = setTimeout(() => {
      setRoleLoading(false);
      setRoleFetchAttempted(true);
    }, 3000); // 3 second timeout

    let isMounted = true;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('user_role')
          .eq('id', user.id)
          .single();
        
        if (isMounted) {
          clearTimeout(timeoutId);
          if (!error && data?.user_role) {
            setRole(data.user_role);
          }
          setRoleFetchAttempted(true);
        }
      } catch (err) {
        if (isMounted) {
          clearTimeout(timeoutId);
          setRoleFetchAttempted(true);
          console.error('Error fetching role:', err);
        }
      } finally {
        if (isMounted) {
          setRoleLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user, roleFetchAttempted, role]);  // Removed 'role' from dependencies to prevent potential re-run issues

  // load admin data once role confirmed
  useEffect(() => {
    if (!authLoading && role === 'admin') {
      void fetchProducts();
      void fetchOrders();
      void fetchWebsiteItems();
    }
  }, [authLoading, role]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const fetchWebsiteItems = async () => {
    const { data } = await supabase
      .from('website_items')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });
    setWebsiteItems(data || []);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    console.log('🔍 Validating form...');
    console.log('Name:', productForm.name.trim());
    console.log('Retailer price:', productForm.retailer_price);
    console.log('Dealer price:', productForm.dealer_price);
    console.log('Stock:', productForm.stock);
    
    if (!productForm.name.trim()) {
      errors.name = 'Product name is required';
      console.error('Name validation failed');
    }
    if (!productForm.retailer_price || isNaN(parseFloat(productForm.retailer_price)) || parseFloat(productForm.retailer_price) <= 0) {
      errors.retailer_price = 'Valid retailer price is required (must be greater than 0)';
      console.error(' Retailer price validation failed');
    }
    if (!productForm.dealer_price || isNaN(parseFloat(productForm.dealer_price)) || parseFloat(productForm.dealer_price) <= 0) {
      errors.dealer_price = 'Valid dealer price is required (must be greater than 0)';
      console.error(' Dealer price validation failed');
    }
    if (productForm.dealer_price && productForm.retailer_price && parseFloat(productForm.dealer_price) >= parseFloat(productForm.retailer_price)) {
      errors.dealer_price = 'Dealer price must be less than retailer price';
      console.error(' Dealer price must be less than retailer price');
    }
    if (!productForm.stock || isNaN(parseInt(productForm.stock)) || parseInt(productForm.stock) < 0) {
      errors.stock = 'Valid stock quantity is required (must be 0 or greater)';
      console.error(' Stock validation failed');
    }
    // Image is optional (can be added later) - removed strict requirement
    // Products can be added without images for now
    
    console.log('Validation errors:', errors);
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    console.log('Validation result:', isValid ? '✅ PASSED' : '❌ FAILED');
    return isValid;
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading to storage bucket "product-images", path:', filePath);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        if (error.message.includes('Bucket not found')) {
          alert(' Storage bucket "product-images" not found!\n\nPlease create it in Supabase Dashboard:\n1. Go to Storage\n2. Create bucket named "product-images"\n3. Make it public\n4. Set up policies (see STORAGE_SETUP.md)');
        } else if (error.message.includes('new row violates row-level security')) {
          alert(' Storage policy error!\n\nPlease check storage policies in Supabase Dashboard.');
        } else {
          alert(` Upload error: ${error.message}`);
        }
        return null;
      }

      console.log('File uploaded successfully:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Exception uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(` Failed to upload image: ${errorMessage}`);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(' handleAddProduct called!');
    console.log('Form data:', productForm);
    console.log('Selected image file:', selectedImageFile);
    
    setFormErrors({});
    
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    console.log('Form errors:', formErrors);
    
    if (!isValid) {
      console.error(' Form validation failed!');
      console.error('Errors:', formErrors);
      alert(` Please fix the following errors:\n${Object.values(formErrors).join('\n')}`);
      return;
    }
    
    console.log(' Form validation passed, proceeding...');

    setIsSubmitting(true);
    try {
      let imageUrl: string | null = null;
      
      // Upload image file if selected
      if (selectedImageFile) {
        console.log('Uploading image file...');
        const uploadedUrl = await uploadImageToSupabase(selectedImageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          console.log('Image uploaded successfully:', uploadedUrl);
        } else {
          // Continue without image if upload fails (for testing)
          console.warn('Image upload failed, continuing without image');
          alert(' Image upload failed, but product will be added without image.\n\nTo fix: Create storage bucket "product-images" in Supabase Dashboard → Storage');
        }
      } else if (editingProduct && editingProduct.image_url) {
        // Keep existing image when editing if no new file is selected
        imageUrl = editingProduct.image_url;
      }

      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim() || null,
        image_url: imageUrl,
        retailer_price: parseFloat(productForm.retailer_price),
        dealer_price: parseFloat(productForm.dealer_price),
        min_dealer_quantity: parseInt(productForm.min_dealer_quantity) || 1,
        stock: parseInt(productForm.stock),
      };

      console.log('Inserting product with data:', productData);

      // Check if user is authenticated and get their role
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        alert(' You must be logged in to add products.');
        setIsSubmitting(false);
        return;
      }

      // Verify admin role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_role')
        .eq('id', currentUser.id)
        .single();

      if (!profile || profile.user_role !== 'admin') {
        alert(` Access denied. Your role is: ${profile?.user_role || 'not set'}\n\nPlease ensure your user_role is set to "admin" in the user_profiles table.`);
        setIsSubmitting(false);
        return;
      }

      console.log('Admin verified, inserting product...');

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) {
        console.error('Database error:', error);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
        let errorMessage = ` Error adding product: ${error.message}`;
        
        if (error.code === '42501' || error.message.includes('row-level security')) {
          errorMessage += '\n\n🔧 FIX: Run QUICK_FIX_PRODUCTS.sql in Supabase SQL Editor';
        } else if (error.code === 'PGRST116') {
          errorMessage += '\n\n🔧 FIX: Check that products table exists and RLS is configured';
        }
        
        alert(errorMessage);
        setIsSubmitting(false);
        return;
      }

      if (data && data.length > 0) {
        console.log(' Product inserted successfully:', data[0]);
        const productName = productForm.name.trim();
        resetForm();
        setShowAddProduct(false);
        await fetchProducts();
        alert(` Product "${productName}" added successfully!\n\nYour product is now visible on the website for customers, dealers, and retailers to view and order.`);
      } else {
        console.error('No data returned from insert');
        alert(' Product was not created. No data returned. Check console for details.');
      }
    } catch (err: unknown) {
      console.error('Exception adding product:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(` Error adding product: ${message}\n\nPlease check the browser console (F12) for more details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImageFile(file);
      setProductForm({ ...productForm, image_url: '' }); // Clear URL if file is selected
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setFormErrors({});
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = productForm.image_url.trim() || editingProduct.image_url || null;
      
      // Upload new image file if selected
      if (selectedImageFile) {
        const uploadedUrl = await uploadImageToSupabase(selectedImageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          alert(' Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: productForm.name.trim(),
          description: productForm.description.trim() || null,
          image_url: imageUrl,
          retailer_price: parseFloat(productForm.retailer_price),
          dealer_price: parseFloat(productForm.dealer_price),
          min_dealer_quantity: parseInt(productForm.min_dealer_quantity) || 1,
          stock: parseInt(productForm.stock),
        })
        .eq('id', editingProduct.id);

      if (!error) {
        const productName = productForm.name.trim();
        resetForm();
        setShowAddProduct(false);
        await fetchProducts();
        alert(` Product "${productName}" updated successfully!`);
      } else {
        console.error('Error updating product:', error);
        alert(` Error updating product: ${error.message || 'Unknown error'}`);
      }
    } catch (err: unknown) {
      console.error('Exception updating product:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(` Error updating product: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      void fetchProducts();
      alert('Product deleted!');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (!error) {
      void fetchOrders();
      alert('Order status updated!');
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description ?? '',
      image_url: product.image_url ?? '',
      retailer_price: product.retailer_price.toString(),
      dealer_price: product.dealer_price.toString(),
      min_dealer_quantity: product.min_dealer_quantity.toString(),
      stock: product.stock.toString(),
    });
    setImagePreview(product.image_url ?? null);
    setSelectedImageFile(null);
    setFormErrors({});
    setShowAddProduct(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      image_url: '',
      retailer_price: '',
      dealer_price: '',
      min_dealer_quantity: '',
      stock: '',
    });
    setImagePreview(null);
    setSelectedImageFile(null);
    setFormErrors({});
    setEditingProduct(null);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    let content: ItemContent = {};
    try {
      if (itemForm.custom_fields.trim()) {
        content = JSON.parse(itemForm.custom_fields);
      }
    } catch {
      alert('Invalid JSON in custom fields. Please check the format.');
      return;
    }

    const { error } = await supabase.from('website_items').insert([
      {
        title: itemForm.title,
        description: itemForm.description || null,
        image_url: itemForm.image_url || null,
        category: itemForm.category || null,
        item_type: itemForm.item_type,
        content: content,
        is_published: itemForm.is_published,
        order_index: parseInt(itemForm.order_index) || 0,
      },
    ]);

    if (!error) {
      setItemForm({
        title: '',
        description: '',
        image_url: '',
        category: '',
        item_type: 'general',
        is_published: true,
        order_index: '0',
        custom_fields: '',
      });
      setShowAddItem(false);
      void fetchWebsiteItems();
      alert('Item added successfully!');
    } else {
      alert(`Error adding item: ${error.message}`);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let content: ItemContent = {};
    try {
      if (itemForm.custom_fields.trim()) {
        content = JSON.parse(itemForm.custom_fields);
      }
    } catch {
      alert('Invalid JSON in custom fields. Please check the format.');
      return;
    }

    const { error } = await supabase
      .from('website_items')
      .update({
        title: itemForm.title,
        description: itemForm.description || null,
        image_url: itemForm.image_url || null,
        category: itemForm.category || null,
        item_type: itemForm.item_type,
        content: content,
        is_published: itemForm.is_published,
        order_index: parseInt(itemForm.order_index) || 0,
      })
      .eq('id', editingItem.id);

    if (!error) {
      setEditingItem(null);
      setItemForm({
        title: '',
        description: '',
        image_url: '',
        category: '',
        item_type: 'general',
        is_published: true,
        order_index: '0',
        custom_fields: '',
      });
      setShowAddItem(false);
      void fetchWebsiteItems();
      alert('Item updated successfully!');
    } else {
      alert(`Error updating item: ${error.message}`);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const { error } = await supabase.from('website_items').delete().eq('id', id);
    if (!error) {
      void fetchWebsiteItems();
      alert('Item deleted!');
    } else {
      alert(`Error deleting item: ${error.message}`);
    }
  };

  const startEditItem = (item: WebsiteItem) => {
    setEditingItem(item);
    setItemForm({
      title: item.title,
      description: item.description ?? '',
      image_url: item.image_url ?? '',
      category: item.category ?? '',
      item_type: item.item_type,
      is_published: item.is_published,
      order_index: item.order_index.toString(),
      custom_fields: item.content ? JSON.stringify(item.content, null, 2) : '',
    });
    setShowAddItem(true);
  };

  // Wait until we KNOW the role before deciding, but with timeout
  const stillLoading = authLoading || (user && !role && !roleFetchAttempted) || roleLoading;
  
  if (stillLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl font-bold">LOADING...</div>
          <p className="text-sm text-gray-500 mt-2">Checking admin access...</p>
        </div>
      </main>
    );
  }

  // Final guard
 if (!user || role !== 'admin') {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-100 p-6">
      <div className="neo-card bg-white max-w-2xl w-full p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000]">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Admin Access Required
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            You don’t have permission to access this page.
          </p>
        </div>

        {/* LOGGED IN BUT NOT ADMIN */}
        {user && role !== 'admin' && (
          <div className="space-y-6">  
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Admin Security System · Unauthorized access is restricted
        </div>
      </div>
    </main>
  );
}
 return (
  <main className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50 to-purple-100 p-8">
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            ⚙️ Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage products, orders, and website content from one place
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="neo-btn-secondary px-6 py-3 text-lg"
        >
          ← Back to Store
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-4 mb-10">
        {[
          { key: 'products', label: '📦 Products' },
          { key: 'orders', label: '🧾 Orders' },
          { key: 'items', label: '🖥 Website Items' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'products' | 'orders' | 'items')}
            className={`px-6 py-3 text-lg font-bold rounded-xl border-3 border-black transition-all
              ${activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-[4px_4px_0_#000]'
                : 'bg-white hover:bg-indigo-50 neo-btn-secondary'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div>

          {/* TOP BAR */}
          <div className="flex flex-wrap gap-6 justify-between items-center mb-10">
            <div>
              <button
                onClick={() => {
                  setShowAddProduct(!showAddProduct);
                  resetForm();
                }}
                className="neo-btn-accent px-8 py-4 text-xl font-bold shadow-lg"
              >
                {showAddProduct ? '✖ Cancel' : '➕ Add New Product'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Products added here are visible to customers and dealers
              </p>
            </div>

            <div className="neo-card px-8 py-6 text-center bg-white">
              <div className="text-4xl font-extrabold text-indigo-600">
                {products.length}
              </div>
              <div className="text-sm text-gray-600">
                Total Products
              </div>
              <Link
                href="/#products"
                target="_blank"
                className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
              >
                👁 View on Website →
              </Link>
            </div>
          </div>

          {/* ADD / EDIT FORM */}
          {showAddProduct && (
            <div className="neo-card mb-12 p-8 bg-white border-4 border-indigo-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">
                    {editingProduct ? '✏️ Edit Product' : '➕ Add Product'}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {editingProduct
                      ? 'Update product details'
                      : 'Fill all required fields to add a new product'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddProduct(false);
                    resetForm();
                  }}
                  className="text-3xl font-bold text-gray-500 hover:text-gray-800"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  console.log('📝 Form onSubmit triggered!');
                  console.log('Editing product?', editingProduct);
                  e.preventDefault();
                  if (editingProduct) {
                    console.log('Calling handleUpdateProduct');
                    handleUpdateProduct(e);
                  } else {
                    console.log('Calling handleAddProduct');
                    handleAddProduct(e);
                  }
                }}
                className="space-y-10"
              >
                {/* IMAGE */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-bold mb-2 block">📷 Upload Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="neo-input w-full border-2 p-3"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Select an image from your gallery (Max 5MB)
                    </p>
                    {formErrors.image_url && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.image_url}</p>
                    )}
                  </div>

                  <div className="border-3 border-dashed border-indigo-300 rounded-xl aspect-square flex items-center justify-center bg-indigo-50 overflow-hidden">
                    {imagePreview ? (
                       
                      <img src={imagePreview} className="object-cover w-full h-full rounded-xl" alt="Preview" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="text-5xl mb-2">🖼</div>
                        <p className="text-sm">Image Preview</p>
                        <p className="text-xs mt-2">Upload an image to see preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* NAME */}
                <div>
                  <label className="font-bold mb-2 block">
                     Product Name *
                  </label>
                  <input
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className={`neo-input w-full border-2 ${formErrors.name ? 'border-red-500' : ''}`}
                    placeholder="Product name"
                  />
                  {formErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="font-bold mb-2 block">📝 Description</label>
                  <textarea
                    rows={4}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="neo-input w-full border-2"
                  />
                </div>

                {/* PRICING */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="neo-card p-4">
                    <label className="font-bold">Retail Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={productForm.retailer_price}
                      onChange={(e) => setProductForm({ ...productForm, retailer_price: e.target.value })}
                      className={`neo-input w-full mt-2 border-2 ${formErrors.retailer_price ? 'border-red-500' : ''}`}
                      placeholder='Enter Retail Price'
                    />
                    {formErrors.retailer_price && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.retailer_price}</p>
                    )}
                  </div>

                  <div className="neo-card p-4">
                    <label className="font-bold">Dealer Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={productForm.dealer_price}
                      onChange={(e) => setProductForm({ ...productForm, dealer_price: e.target.value })}
                      className={`neo-input w-full mt-2 border-2 ${formErrors.dealer_price ? 'border-red-500' : ''}`}
                      placeholder='Enter Dealer Price'
                    />
                    {formErrors.dealer_price && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.dealer_price}</p>
                    )}
                  </div>

                  <div className="neo-card p-4 bg-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        {productForm.retailer_price && productForm.dealer_price
                          ? `${Math.round(
                              ((parseFloat(productForm.retailer_price) - parseFloat(productForm.dealer_price)) /
                                parseFloat(productForm.retailer_price)) *
                                100
                            )}%`
                          : '0%'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Dealer Discount
                      </div>
                    </div>
                  </div>
                </div>

                {/* STOCK AND MIN DEALER QUANTITY */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-bold mb-2 block"> Stock Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className={`neo-input w-full border-2 ${formErrors.stock ? 'border-red-500' : ''}`}
                      placeholder="Enter stock quantity"
                    />
                    {formErrors.stock && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.stock}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-bold mb-2 block">📦 Min Dealer Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={productForm.min_dealer_quantity}
                      onChange={(e) => setProductForm({ ...productForm, min_dealer_quantity: e.target.value })}
                      className="neo-input w-full border-2"
                      placeholder="Minimum quantity for dealers (default: 1)"
                    />
                    <p className="text-xs text-gray-600 mt-1">Minimum quantity dealers must order</p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 pt-6 border-t-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingImage}
                    className="neo-btn-accent flex-1 text-xl py-4 mr-40 p-6 bg-indigo-600 text-amber-50 font-bold hover:bg-indigo-700 transition-colors  border-black border border-rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingImage
                      ? '⏳ Uploading Image...'
                      : isSubmitting
                      ? '⏳ Processing...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProduct(false);
                      resetForm();
                    }}
                    className="neo-btn-secondary text-lg px-8 bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors border-black border border-rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="neo-card hover:scale-[1.02] transition-transform">
                <div className="aspect-square mb-4 bg-gray-100 border-3 border-black rounded-lg overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} className="object-cover w-full h-full" alt={product.name} />
                  ) : (
                    <div className="flex items-center justify-center text-5xl">📦</div>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                <div className="text-sm space-y-1 mb-4">
                  <p>Retail: ₹{product.retailer_price}</p>
                  <p>Dealer: ₹{product.dealer_price}</p>
                  <p>Stock: {product.stock}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(product)}
                    className="neo-btn-secondary flex-1"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 bg-red-500 text-white border-3 border-black font-bold"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="neo-card">
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="font-bold">Customer</p>
                  <p>{order.customer_name}</p>
                  <p className="text-sm">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="font-bold">Type</p>
                  <p className="uppercase">{order.customer_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold">Total</p>
                  <p className="text-xl text-[rgb(var(--primary))]">₹{order.total_amount}</p>
                </div>
                <div>
                  <p className="font-bold">UPI ID</p>
                  <p className="text-sm break-all">{order.upi_transaction_id}</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-100 border-2 border-black">
                <p className="font-bold mb-2">Items:</p>
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-sm">
                    {item.product_name} x {item.quantity} = ₹{item.price * item.quantity}
                  </p>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className="neo-input"
                >
                  <option value="pending">PENDING</option>
                  <option value="confirmed">CONFIRMED</option>
                  <option value="shipped">SHIPPED</option>
                  <option value="delivered">DELIVERED</option>
                  <option value="cancelled">CANCELLED</option>
                </select>
                <span className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'items' && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => {
                setShowAddItem(!showAddItem);
                setEditingItem(null);
                setItemForm({
                  title: '',
                  description: '',
                  image_url: '',
                  category: '',
                  item_type: 'general',
                  is_published: true,
                  order_index: '0',
                  custom_fields: '',
                });
              }}
              className="neo-btn-accent"
            >
              {showAddItem ? 'CANCEL' : '+ ADD WEBSITE ITEM'}
            </button>
          </div>

          {showAddItem && (
            <div className="neo-card mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingItem ? 'EDIT WEBSITE ITEM' : 'ADD NEW WEBSITE ITEM'}
              </h2>
              <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-bold mb-2">TITLE *</label>
                    <input
                      type="text"
                      required
                      value={itemForm.title}
                      onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                      className="neo-input"
                      placeholder="Item Title"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2">CATEGORY</label>
                    <input
                      type="text"
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="neo-input"
                      placeholder="e.g., banner, feature, content"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2">ITEM TYPE</label>
                    <select
                      value={itemForm.item_type}
                      onChange={(e) => setItemForm({ ...itemForm, item_type: e.target.value })}
                      className="neo-input"
                    >
                      <option value="general">General</option>
                      <option value="banner">Banner</option>
                      <option value="feature">Feature</option>
                      <option value="content">Content</option>
                      <option value="testimonial">Testimonial</option>
                      <option value="link">Link</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-2">IMAGE URL</label>
                    <input
                      type="url"
                      value={itemForm.image_url}
                      onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
                      className="neo-input"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2">ORDER INDEX</label>
                    <input
                      type="number"
                      value={itemForm.order_index}
                      onChange={(e) => setItemForm({ ...itemForm, order_index: e.target.value })}
                      className="neo-input"
                      placeholder="0"
                    />
                    <p className="text-xs mt-1 text-gray-600">Lower numbers appear first</p>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={itemForm.is_published}
                        onChange={(e) => setItemForm({ ...itemForm, is_published: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="font-bold">PUBLISHED</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-2">DESCRIPTION</label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    className="neo-input"
                    rows={4}
                    placeholder="Item description..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-2">CUSTOM FIELDS (JSON)</label>
                  <textarea
                    value={itemForm.custom_fields}
                    onChange={(e) => setItemForm({ ...itemForm, custom_fields: e.target.value })}
                    className="neo-input font-mono text-sm"
                    rows={6}
                    placeholder='{"link": "/products", "buttonText": "Shop Now", "color": "#FF5733"}'
                  />
                  <p className="text-xs mt-1 text-gray-600">
                    Optional: Add custom JSON fields for additional data (e.g., links, buttons, colors)
                  </p>
                </div>
                <button type="submit" className="neo-btn">
                  {editingItem ? 'UPDATE ITEM' : 'ADD ITEM'}
                </button>
              </form>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websiteItems.map((item) => (
              <div key={item.id} className="neo-card">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded border-2 border-black ${
                    item.is_published ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    {item.is_published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded border-2 border-black font-bold">
                    {item.item_type.toUpperCase()}
                  </span>
                </div>
                
                {item.image_url && (
                  // eslint-disable-next-line react/jsx-no-comment-textnodes
                  <div className="aspect-video bg-gray-200 border-3 border-black mb-4">
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                {item.category && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-bold">Category:</span> {item.category}
                  </p>
                )}
                <p className="text-sm mb-2 line-clamp-3">{item.description}</p>
                
                {item.content && Object.keys(item.content).length > 0 && (
                  <div className="mb-3 p-2 bg-gray-100 border-2 border-black rounded text-xs">
                    <p className="font-bold mb-1">Custom Fields:</p>
                    <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-word">
                      {JSON.stringify(item.content, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mb-4">
                  <p>Order: {item.order_index}</p>
                  <p>Created: {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEditItem(item)} 
                    className="neo-btn-secondary flex-1 text-sm py-2"
                  >
                    EDIT
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)} 
                    className="flex-1 text-sm py-2 bg-red-500 text-white border-3 border-black font-bold"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
            
            {websiteItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-xl font-bold">No website items yet</p>
                <p className="text-gray-600 mt-2">Click &quot;+ ADD WEBSITE ITEM&quot; to get started!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </main>
);
}