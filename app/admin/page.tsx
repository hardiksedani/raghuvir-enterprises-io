/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD

import { supabase, type Product, type Order, type WebsiteItem } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

// Define a type for the item form content to avoid 'any'
type ItemContent = Record<string, unknown>;

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  // local role that can be filled from profile OR DB
=======
import { supabase, type Product, type Order, type WebsiteItem } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import {
  Package, ClipboardList, Monitor, Plus, X, ChevronRight,
  Edit2, Trash2, ImageIcon, CheckCircle, Truck, Gift, XCircle,
  Clock, MapPin, Phone, User, CreditCard, ShoppingBag, TrendingUp,
  AlertCircle, LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ItemContent = Record<string, unknown>;

const STATUS_CFG = {
  pending:   { label: 'Pending',    dot: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-800 border-amber-200'   },
  confirmed: { label: 'Ready',      dot: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-800 border-blue-200'      },
  shipped:   { label: 'On The Way', dot: 'bg-purple-500',  badge: 'bg-purple-100 text-purple-800 border-purple-200'},
  delivered: { label: 'Delivered',  dot: 'bg-green-500',   badge: 'bg-green-100 text-green-800 border-green-200'   },
  cancelled: { label: 'Cancelled',  dot: 'bg-red-400',     badge: 'bg-red-100 text-red-700 border-red-200'         },
} as const;

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { showToast } = useToast();

>>>>>>> d4b4a93 (update code)
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
<<<<<<< HEAD
    name: '',
    description: '',
    image_url: '',
    retailer_price: '',
    dealer_price: '',
    min_dealer_quantity: '',
    stock: '',
=======
    name: '', description: '', image_url: '',
    retailer_price: '', dealer_price: '',
    min_dealer_quantity: '', stock: '',
>>>>>>> d4b4a93 (update code)
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [itemForm, setItemForm] = useState({
<<<<<<< HEAD
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
=======
    title: '', description: '', image_url: '', category: '',
    item_type: 'general', is_published: true, order_index: '0', custom_fields: '',
  });
  const [selectedItemImageFile, setSelectedItemImageFile] = useState<File | null>(null);
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.user_role) { setRole(profile.user_role); setRoleFetchAttempted(true); }
  }, [profile]);

  useEffect(() => {
    if (!user || role || roleFetchAttempted) return;
    setRoleLoading(true);
    const tid = setTimeout(() => { setRoleLoading(false); setRoleFetchAttempted(true); }, 3000);
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('user_profiles').select('user_role').eq('id', user.id).single();
        if (mounted) {
          clearTimeout(tid);
          if (!error && data?.user_role) setRole(data.user_role);
          setRoleFetchAttempted(true);
        }
      } catch (err) {
        if (mounted) { clearTimeout(tid); setRoleFetchAttempted(true); console.error('Error fetching role:', err); }
      } finally {
        if (mounted) setRoleLoading(false);
      }
    })();
    return () => { mounted = false; clearTimeout(tid); };
  }, [user, roleFetchAttempted, role]);

>>>>>>> d4b4a93 (update code)
  useEffect(() => {
    if (!authLoading && role === 'admin') {
      void fetchProducts();
      void fetchOrders();
      void fetchWebsiteItems();
    }
  }, [authLoading, role]);

  const fetchProducts = async () => {
<<<<<<< HEAD
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
=======
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };
  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };
  const fetchWebsiteItems = async () => {
    const { data } = await supabase.from('website_items').select('*').order('order_index', { ascending: true }).order('created_at', { ascending: false });
>>>>>>> d4b4a93 (update code)
    setWebsiteItems(data || []);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
<<<<<<< HEAD
    
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
=======
    if (!productForm.name.trim()) errors.name = 'Product name is required';
    if (!productForm.retailer_price || isNaN(parseFloat(productForm.retailer_price)) || parseFloat(productForm.retailer_price) <= 0)
      errors.retailer_price = 'Valid retailer price required (> 0)';
    if (!productForm.dealer_price || isNaN(parseFloat(productForm.dealer_price)) || parseFloat(productForm.dealer_price) <= 0)
      errors.dealer_price = 'Valid dealer price required (> 0)';
    if (productForm.dealer_price && productForm.retailer_price && parseFloat(productForm.dealer_price) >= parseFloat(productForm.retailer_price))
      errors.dealer_price = 'Dealer price must be less than retailer price';
    if (!productForm.stock || isNaN(parseInt(productForm.stock)) || parseInt(productForm.stock) < 0)
      errors.stock = 'Valid stock quantity required (≥ 0)';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
>>>>>>> d4b4a93 (update code)
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
<<<<<<< HEAD
      
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
=======
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error } = await supabase.storage.from('product-images').upload(`products/${fileName}`, file, { cacheControl: '3600', upsert: false });
      if (error) { console.error('Storage upload error:', error.message); showToast('Failed to upload image. Please try again.', 'error'); return null; }
      void data;
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(`products/${fileName}`);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Exception uploading image:', error);
      showToast('Failed to upload image. Please try again.', 'error');
>>>>>>> d4b4a93 (update code)
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
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

=======
    setFormErrors({});
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (selectedImageFile) {
        const uploaded = await uploadImageToSupabase(selectedImageFile);
        if (uploaded) imageUrl = uploaded;
      } else if (editingProduct?.image_url) {
        imageUrl = editingProduct.image_url;
      }
>>>>>>> d4b4a93 (update code)
      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim() || null,
        image_url: imageUrl,
        retailer_price: parseFloat(productForm.retailer_price),
        dealer_price: parseFloat(productForm.dealer_price),
        min_dealer_quantity: parseInt(productForm.min_dealer_quantity) || 1,
        stock: parseInt(productForm.stock),
      };
<<<<<<< HEAD

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
=======
      const { data: { user: cur } } = await supabase.auth.getUser();
      if (!cur) { showToast('You must be logged in to add products.', 'error'); setIsSubmitting(false); return; }
      const { data: p } = await supabase.from('user_profiles').select('user_role').eq('id', cur.id).single();
      if (!p || p.user_role !== 'admin') { showToast('Access denied. Admin role required.', 'error'); setIsSubmitting(false); return; }
      const { data, error } = await supabase.from('products').insert([productData]).select();
      if (error) { console.error('Error adding product:', error.message); showToast('Error adding product. Please try again.', 'error'); setIsSubmitting(false); return; }
      if (data && data.length > 0) {
        const name = productForm.name.trim();
        resetForm(); setShowAddProduct(false); await fetchProducts();
        showToast(`"${name}" added successfully!`, 'success');
      } else {
        showToast('Product was not created. Please try again.', 'error');
      }
    } catch (err) { console.error('Exception adding product:', err); showToast('Error adding product. Please try again.', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const uploadItemImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error } = await supabase.storage.from('product-images').upload(`website-items/${fileName}`, file, { cacheControl: '3600', upsert: false });
      if (error) { console.error('Item image upload error:', error.message); showToast('Failed to upload image. Please try again.', 'error'); return null; }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(`website-items/${fileName}`);
      return urlData.publicUrl;
    } catch (err) { console.error('Exception uploading item image:', err); showToast('Failed to upload image.', 'error'); return null; }
    finally { setIsUploadingImage(false); }
  };

  const handleItemImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'warning'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB', 'warning'); return; }
    setSelectedItemImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setItemImagePreview(reader.result as string);
    reader.readAsDataURL(file);
>>>>>>> d4b4a93 (update code)
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
<<<<<<< HEAD
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
=======
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'warning'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB', 'warning'); return; }
    setSelectedImageFile(file);
    setProductForm({ ...productForm, image_url: '' });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
>>>>>>> d4b4a93 (update code)
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
<<<<<<< HEAD
    
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
=======
    setFormErrors({});
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      let imageUrl = productForm.image_url.trim() || editingProduct.image_url || null;
      if (selectedImageFile) {
        const uploaded = await uploadImageToSupabase(selectedImageFile);
        if (uploaded) imageUrl = uploaded;
        else { showToast('Failed to upload image. Please try again.', 'error'); setIsSubmitting(false); return; }
      }
      const { error } = await supabase.from('products').update({
        name: productForm.name.trim(),
        description: productForm.description.trim() || null,
        image_url: imageUrl,
        retailer_price: parseFloat(productForm.retailer_price),
        dealer_price: parseFloat(productForm.dealer_price),
        min_dealer_quantity: parseInt(productForm.min_dealer_quantity) || 1,
        stock: parseInt(productForm.stock),
      }).eq('id', editingProduct.id);
      if (!error) {
        const name = productForm.name.trim();
        resetForm(); setShowAddProduct(false); await fetchProducts();
        showToast(`"${name}" updated!`, 'success');
      } else {
        console.error('Error updating product:', error.message);
        showToast('Error updating product. Please try again.', 'error');
      }
    } catch (err) { console.error('Exception updating product:', err); showToast('Error updating product. Please try again.', 'error'); }
    finally { setIsSubmitting(false); }
>>>>>>> d4b4a93 (update code)
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
<<<<<<< HEAD
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
=======
    if (!error) { void fetchProducts(); showToast('Product deleted', 'success'); }
    else showToast('Error deleting product', 'error');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) { void fetchOrders(); showToast(`Order marked as ${STATUS_CFG[status as keyof typeof STATUS_CFG]?.label ?? status}`, 'success'); }
    else showToast('Error updating order status', 'error');
>>>>>>> d4b4a93 (update code)
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
<<<<<<< HEAD
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
=======
    setProductForm({ name: '', description: '', image_url: '', retailer_price: '', dealer_price: '', min_dealer_quantity: '', stock: '' });
    setImagePreview(null); setSelectedImageFile(null); setFormErrors({}); setEditingProduct(null);
>>>>>>> d4b4a93 (update code)
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    let content: ItemContent = {};
<<<<<<< HEAD
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
=======
    try { if (itemForm.custom_fields.trim()) content = JSON.parse(itemForm.custom_fields); }
    catch { showToast('Invalid JSON in custom fields. Please check the format.', 'error'); return; }
    let imageUrl: string | null = null;
    if (selectedItemImageFile) {
      const uploaded = await uploadItemImage(selectedItemImageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
    }
    const { error } = await supabase.from('website_items').insert([{
      title: itemForm.title, description: itemForm.description || null,
      image_url: imageUrl, category: itemForm.category || null,
      item_type: itemForm.item_type, content, is_published: itemForm.is_published,
      order_index: parseInt(itemForm.order_index) || 0,
    }]);
    if (!error) {
      setItemForm({ title: '', description: '', image_url: '', category: '', item_type: 'general', is_published: true, order_index: '0', custom_fields: '' });
      setSelectedItemImageFile(null); setItemImagePreview(null);
      setShowAddItem(false); void fetchWebsiteItems(); showToast('Item added!', 'success');
    } else showToast('Error adding item.', 'error');
>>>>>>> d4b4a93 (update code)
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
<<<<<<< HEAD

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
=======
    let content: ItemContent = {};
    try { if (itemForm.custom_fields.trim()) content = JSON.parse(itemForm.custom_fields); }
    catch { showToast('Invalid JSON in custom fields.', 'error'); return; }
    let imageUrl: string | null = editingItem.image_url || null;
    if (selectedItemImageFile) {
      const uploaded = await uploadItemImage(selectedItemImageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
    }
    const { error } = await supabase.from('website_items').update({
      title: itemForm.title, description: itemForm.description || null,
      image_url: imageUrl, category: itemForm.category || null,
      item_type: itemForm.item_type, content, is_published: itemForm.is_published,
      order_index: parseInt(itemForm.order_index) || 0,
    }).eq('id', editingItem.id);
    if (!error) {
      setEditingItem(null);
      setItemForm({ title: '', description: '', image_url: '', category: '', item_type: 'general', is_published: true, order_index: '0', custom_fields: '' });
      setSelectedItemImageFile(null); setItemImagePreview(null);
      setShowAddItem(false); void fetchWebsiteItems(); showToast('Item updated!', 'success');
    } else showToast('Error updating item.', 'error');
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this website item?')) return;
    const { error } = await supabase.from('website_items').delete().eq('id', id);
    if (!error) { void fetchWebsiteItems(); showToast('Item deleted', 'success'); }
    else showToast('Error deleting item.', 'error');
>>>>>>> d4b4a93 (update code)
  };

  const startEditItem = (item: WebsiteItem) => {
    setEditingItem(item);
    setItemForm({
<<<<<<< HEAD
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
=======
      title: item.title, description: item.description ?? '', image_url: item.image_url ?? '',
      category: item.category ?? '', item_type: item.item_type, is_published: item.is_published,
      order_index: item.order_index.toString(),
      custom_fields: item.content ? JSON.stringify(item.content, null, 2) : '',
    });
    setItemImagePreview(item.image_url ?? null);
    setSelectedItemImageFile(null);
    setShowAddItem(true);
  };

  // ── Loading / access guards ─────────────────────────────────────────────────
  const stillLoading = authLoading || (user && !role && !roleFetchAttempted) || roleLoading;

  if (stillLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--primary))]/10 flex items-center justify-center mx-auto animate-pulse">
            <LayoutDashboard className="w-8 h-8 text-[rgb(var(--primary))]" />
          </div>
          <div>
            <div className="font-bold text-lg text-[rgb(var(--text))]">Loading Dashboard</div>
            <p className="text-sm text-[rgb(var(--muted))] mt-1">Checking admin access...</p>
          </div>
>>>>>>> d4b4a93 (update code)
        </div>
      </main>
    );
  }

<<<<<<< HEAD
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
=======
  if (!user || role !== 'admin') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[rgb(var(--bg))]">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[rgb(var(--text))]">Admin Access Required</h1>
            <p className="text-[rgb(var(--muted))] mt-2 text-sm">You don&apos;t have permission to access this page.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgb(var(--primary))] text-white font-semibold text-sm hover:opacity-90 transition-all"
          >
            ← Back to Store
          </Link>
        </div>
      </main>
    );
  }

  // ── Derived stats ────────────────────────────────────────────────────────────
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_amount, 0);

  const TABS = [
    { key: 'products', label: 'Products', icon: Package, count: products.length },
    { key: 'orders',   label: 'Orders',   icon: ClipboardList, count: orders.length, alert: pendingOrders },
    { key: 'items',    label: 'Website Items', icon: Monitor, count: websiteItems.length },
  ] as const;

  // ── Order status action buttons ──────────────────────────────────────────────
  const getOrderActions = (order: Order) => {
    const actions: { status: string; label: string; icon: React.ElementType; className: string }[] = [];
    if (order.status === 'pending')   actions.push({ status: 'confirmed', label: 'Mark Ready',      icon: CheckCircle, className: 'bg-blue-500 hover:bg-blue-600 text-white' });
    if (order.status === 'confirmed') actions.push({ status: 'shipped',   label: 'Mark On The Way', icon: Truck,       className: 'bg-purple-500 hover:bg-purple-600 text-white' });
    if (order.status === 'shipped')   actions.push({ status: 'delivered', label: 'Mark Delivered',  icon: Gift,        className: 'bg-green-500 hover:bg-green-600 text-white' });
    if (order.status !== 'delivered' && order.status !== 'cancelled')
      actions.push({ status: 'cancelled', label: 'Cancel Order', icon: XCircle, className: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200' });
    return actions;
  };

  // ── Dealer discount helper ───────────────────────────────────────────────────
  const dealerDiscount = (r: string, d: string) => {
    const rp = parseFloat(r); const dp = parseFloat(d);
    if (!rp || !dp || rp <= dp) return null;
    return Math.round(((rp - dp) / rp) * 100);
  };

  return (
    <main className="min-h-screen bg-[rgb(var(--bg))]">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[rgb(var(--primary))] flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <div>
              <div className="font-bold text-[rgb(var(--text))] leading-none">Admin Dashboard</div>
              <div className="text-xs text-[rgb(var(--muted))] mt-0.5">Raghuvir Enterprises</div>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors"
          >
            ← Back to Store
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Stats row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Package,     label: 'Total Products', value: products.length,  color: 'text-[rgb(var(--primary))]',  bg: 'bg-[rgb(var(--primary))]/10'  },
            { icon: ClipboardList, label: 'Total Orders', value: orders.length,    color: 'text-purple-600',              bg: 'bg-purple-100'                 },
            { icon: Clock,       label: 'Pending Orders', value: pendingOrders,    color: 'text-amber-600',               bg: 'bg-amber-100'                  },
            { icon: TrendingUp,  label: 'Total Revenue',  value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'text-green-600', bg: 'bg-green-100' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-5">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              <div className="text-2xl font-black text-[rgb(var(--text))]">{value}</div>
              <div className="text-xs text-[rgb(var(--muted))] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="flex gap-1.5 bg-[rgb(var(--elevated))] p-1.5 rounded-2xl border border-[rgb(var(--border))] w-fit">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-[rgb(var(--surface))] text-[rgb(var(--text))] shadow-sm border border-[rgb(var(--border))]'
                    : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full font-bold',
                  'alert' in tab && tab.alert
                    ? 'bg-amber-500 text-white'
                    : isActive ? 'bg-[rgb(var(--primary))]/15 text-[rgb(var(--primary))]' : 'bg-[rgb(var(--border))] text-[rgb(var(--muted))]'
                )}>
                  {'alert' in tab && tab.alert ? tab.alert : tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ══ PRODUCTS TAB ══════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[rgb(var(--text))]">Products</h2>
                <p className="text-sm text-[rgb(var(--muted))] mt-0.5">{products.length} products · visible to all customers</p>
              </div>
              <button
                onClick={() => { setShowAddProduct(!showAddProduct); resetForm(); }}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                  showAddProduct
                    ? 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]'
                    : 'bg-[rgb(var(--primary))] text-white shadow-[0_4px_16px_rgb(var(--primary)/0.3)] hover:opacity-90'
                )}
              >
                {showAddProduct ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Product</>}
              </button>
            </div>

            {/* ── Add / Edit form ────────────────────────────────────────── */}
            {showAddProduct && (
              <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--elevated))]/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[rgb(var(--text))]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <p className="text-xs text-[rgb(var(--muted))] mt-0.5">{editingProduct ? 'Update product details' : 'Fill all required fields'}</p>
                  </div>
                  <button onClick={() => { setShowAddProduct(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--elevated))] transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => { e.preventDefault(); editingProduct ? handleUpdateProduct(e) : handleAddProduct(e); }}
                  className="p-6 space-y-6"
                >
                  {/* Image upload */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Product Image</label>
                      <label className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50 cursor-pointer transition-all bg-[rgb(var(--elevated))]/50 hover:bg-[rgb(var(--primary))]/5">
                        <ImageIcon className="w-8 h-8 text-[rgb(var(--muted))]" />
                        <div className="text-center">
                          <div className="text-sm font-medium text-[rgb(var(--text))]">Click to upload image</div>
                          <div className="text-xs text-[rgb(var(--muted))] mt-1">PNG, JPG, WebP · Max 5MB</div>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                      </label>
                    </div>
                    <div className="rounded-xl border border-[rgb(var(--border))] aspect-square overflow-hidden bg-[rgb(var(--elevated))] flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} className="object-cover w-full h-full" alt="Preview" />
                      ) : (
                        <div className="text-center text-[rgb(var(--muted))]">
                          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">Image preview</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[rgb(var(--text))]">Product Name *</label>
                    <input
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className={cn('w-full px-4 py-3 rounded-xl border bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm placeholder:text-[rgb(var(--muted))] outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all', formErrors.name ? 'border-red-400' : 'border-[rgb(var(--border))]')}
                      placeholder="e.g. Swami Narayan Farali Ata"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[rgb(var(--text))]">Description</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm placeholder:text-[rgb(var(--muted))] outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all resize-none"
                      placeholder="Brief product description..."
                    />
                  </div>

                  {/* Pricing */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Retail Price (₹) *</label>
                      <input
                        type="number" step="0.01" min="0.01" required
                        value={productForm.retailer_price}
                        onChange={(e) => setProductForm({ ...productForm, retailer_price: e.target.value })}
                        className={cn('w-full px-4 py-3 rounded-xl border bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all', formErrors.retailer_price ? 'border-red-400' : 'border-[rgb(var(--border))]')}
                        placeholder="0.00"
                      />
                      {formErrors.retailer_price && <p className="text-red-500 text-xs">{formErrors.retailer_price}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Dealer Price (₹) *</label>
                      <input
                        type="number" step="0.01" min="0.01" required
                        value={productForm.dealer_price}
                        onChange={(e) => setProductForm({ ...productForm, dealer_price: e.target.value })}
                        className={cn('w-full px-4 py-3 rounded-xl border bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all', formErrors.dealer_price ? 'border-red-400' : 'border-[rgb(var(--border))]')}
                        placeholder="0.00"
                      />
                      {formErrors.dealer_price && <p className="text-red-500 text-xs">{formErrors.dealer_price}</p>}
                    </div>
                    <div className="flex items-center justify-center bg-[rgb(var(--primary))]/8 border border-[rgb(var(--primary))]/20 rounded-xl p-4 text-center">
                      <div>
                        <div className="text-3xl font-black text-[rgb(var(--primary))]">
                          {dealerDiscount(productForm.retailer_price, productForm.dealer_price) !== null
                            ? `${dealerDiscount(productForm.retailer_price, productForm.dealer_price)}%`
                            : '—'}
                        </div>
                        <div className="text-xs text-[rgb(var(--muted))] mt-0.5">Dealer Discount</div>
                      </div>
                    </div>
                  </div>

                  {/* Stock & min qty */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Stock Quantity *</label>
                      <input
                        type="number" min="0" required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        className={cn('w-full px-4 py-3 rounded-xl border bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all', formErrors.stock ? 'border-red-400' : 'border-[rgb(var(--border))]')}
                        placeholder="0"
                      />
                      {formErrors.stock && <p className="text-red-500 text-xs">{formErrors.stock}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Min Dealer Quantity</label>
                      <input
                        type="number" min="1"
                        value={productForm.min_dealer_quantity}
                        onChange={(e) => setProductForm({ ...productForm, min_dealer_quantity: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                        placeholder="1 (default)"
                      />
                      <p className="text-xs text-[rgb(var(--muted))]">Minimum quantity dealers must order</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploadingImage}
                      className="flex-1 py-3 rounded-xl bg-[rgb(var(--primary))] text-white font-bold text-sm shadow-[0_4px_16px_rgb(var(--primary)/0.3)] hover:opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isUploadingImage ? 'Uploading Image...' : isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddProduct(false); resetForm(); }}
                      className="px-6 py-3 rounded-xl border border-[rgb(var(--border))] text-[rgb(var(--text))] text-sm font-semibold hover:bg-[rgb(var(--elevated))] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Product grid ───────────────────────────────────────────── */}
            {products.length === 0 ? (
              <div className="text-center py-20 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl">
                <Package className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--muted))]/40" />
                <h3 className="font-bold text-[rgb(var(--text))]">No products yet</h3>
                <p className="text-sm text-[rgb(var(--muted))] mt-1">Click &ldquo;Add Product&rdquo; to get started</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(product => (
                  <div key={product.id} className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                    <div className="aspect-[4/3] bg-[rgb(var(--elevated))] overflow-hidden relative">
                      {product.image_url ? (
                        <img src={product.image_url} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-12 h-12 text-[rgb(var(--muted))]/30" />
                        </div>
                      )}
                      <div className={cn('absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold', product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-[rgb(var(--text))] line-clamp-1">{product.name}</h3>
                        {product.description && <p className="text-xs text-[rgb(var(--muted))] mt-0.5 line-clamp-2">{product.description}</p>}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-xs text-[rgb(var(--muted))]">Retail</span>
                          <div className="font-bold text-[rgb(var(--text))]">₹{product.retailer_price.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[rgb(var(--muted))]">Dealer</span>
                          <div className="font-bold text-[rgb(var(--primary))]">₹{product.dealer_price.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] px-2 py-1 rounded-lg text-xs font-bold">
                          {Math.round(((product.retailer_price - product.dealer_price) / product.retailer_price) * 100)}% off
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1 border-t border-[rgb(var(--border))]">
                        <button
                          onClick={() => startEdit(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[rgb(var(--border))] text-[rgb(var(--text))] text-xs font-semibold hover:bg-[rgb(var(--elevated))] transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ ORDERS TAB ════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[rgb(var(--text))]">Orders</h2>
              <p className="text-sm text-[rgb(var(--muted))] mt-0.5">
                {orders.length} total · <span className="text-amber-600 font-semibold">{pendingOrders} pending</span>
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--muted))]/40" />
                <h3 className="font-bold text-[rgb(var(--text))]">No orders yet</h3>
                <p className="text-sm text-[rgb(var(--muted))] mt-1">Orders from customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.pending;
                  const actions = getOrderActions(order);
                  return (
                    <div key={order.id} className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
                      {/* Order header */}
                      <div className="px-5 py-3.5 bg-[rgb(var(--elevated))]/60 border-b border-[rgb(var(--border))] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-[rgb(var(--text))]">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border', cfg.badge)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                            {cfg.label}
                          </span>
                        </div>
                        <span className="text-xs text-[rgb(var(--muted))]">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' at '}
                          {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="p-5 space-y-4">
                        {/* Customer info row */}
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-[rgb(var(--muted))] mt-0.5 shrink-0" />
                            <div>
                              <div className="text-xs text-[rgb(var(--muted))] font-medium">Customer</div>
                              <div className="font-semibold text-sm text-[rgb(var(--text))]">{order.customer_name || '—'}</div>
                              <div className="text-xs text-[rgb(var(--muted))]">{order.customer_type?.toUpperCase() || 'RETAILER'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-[rgb(var(--muted))] mt-0.5 shrink-0" />
                            <div>
                              <div className="text-xs text-[rgb(var(--muted))] font-medium">Phone</div>
                              <div className="font-semibold text-sm text-[rgb(var(--text))]">{order.customer_phone || '—'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CreditCard className="w-4 h-4 text-[rgb(var(--muted))] mt-0.5 shrink-0" />
                            <div>
                              <div className="text-xs text-[rgb(var(--muted))] font-medium">Payment</div>
                              <div className="font-semibold text-sm text-[rgb(var(--text))]">
                                {order.upi_transaction_id === 'COD' ? 'Cash on Delivery' : 'Online Paid'}
                              </div>
                              <div className="text-lg font-black text-[rgb(var(--primary))]">₹{order.total_amount.toLocaleString('en-IN')}</div>
                            </div>
                          </div>
                        </div>

                        {/* Delivery address */}
                        {order.delivery_address && (
                          <div className="flex items-start gap-2 p-3 bg-[rgb(var(--elevated))] rounded-xl border border-[rgb(var(--border))]">
                            <MapPin className="w-4 h-4 text-[rgb(var(--primary))] mt-0.5 shrink-0" />
                            <div>
                              <div className="text-xs text-[rgb(var(--muted))] font-medium mb-0.5">Delivery Address</div>
                              <div className="text-sm text-[rgb(var(--text))] whitespace-pre-wrap">{order.delivery_address}</div>
                            </div>
                          </div>
                        )}

                        {/* Items */}
                        <div className="space-y-1.5">
                          <div className="text-xs text-[rgb(var(--muted))] font-medium uppercase tracking-wide flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5" /> Items Ordered
                          </div>
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-2.5 bg-[rgb(var(--elevated))] rounded-xl text-sm border border-[rgb(var(--border))]">
                              <span className="font-medium text-[rgb(var(--text))]">
                                {item.quantity}× {item.product_name}
                              </span>
                              <span className="font-bold text-[rgb(var(--text))]">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        {actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1 border-t border-[rgb(var(--border))]">
                            {actions.map(action => {
                              const Icon = action.icon;
                              return (
                                <button
                                  key={action.status}
                                  onClick={() => handleUpdateOrderStatus(order.id, action.status)}
                                  className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all', action.className)}
                                >
                                  <Icon className="w-4 h-4" />
                                  {action.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {order.status === 'delivered' && (
                          <div className="flex items-center gap-2 text-green-600 text-sm font-semibold pt-1 border-t border-[rgb(var(--border))]">
                            <Gift className="w-4 h-4" />
                            Order delivered successfully
                          </div>
                        )}
                        {order.status === 'cancelled' && (
                          <div className="flex items-center gap-2 text-red-500 text-sm font-semibold pt-1 border-t border-[rgb(var(--border))]">
                            <XCircle className="w-4 h-4" />
                            Order was cancelled
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ WEBSITE ITEMS TAB ══════════════════════════════════════════════════ */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[rgb(var(--text))]">Website Items</h2>
                <p className="text-sm text-[rgb(var(--muted))] mt-0.5">{websiteItems.length} items</p>
              </div>
              <button
                onClick={() => {
                  setShowAddItem(!showAddItem); setEditingItem(null);
                  setItemForm({ title: '', description: '', image_url: '', category: '', item_type: 'general', is_published: true, order_index: '0', custom_fields: '' });
                }}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                  showAddItem
                    ? 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]'
                    : 'bg-[rgb(var(--primary))] text-white shadow-[0_4px_16px_rgb(var(--primary)/0.3)] hover:opacity-90'
                )}
              >
                {showAddItem ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Item</>}
              </button>
            </div>

            {showAddItem && (
              <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-[rgb(var(--text))]">{editingItem ? 'Edit Website Item' : 'Add Website Item'}</h3>
                <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Title *</label>
                      <input required value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                        placeholder="Item title" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Category</label>
                      <input value={itemForm.category} onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                        placeholder="e.g. banner, feature" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Item Type</label>
                      <select value={itemForm.item_type} onChange={(e) => setItemForm({ ...itemForm, item_type: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all">
                        {['general','banner','feature','content','testimonial','link','custom'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Image</label>
                      <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50 cursor-pointer transition-all bg-[rgb(var(--elevated))]/50 hover:bg-[rgb(var(--primary))]/5">
                        <ImageIcon className="w-6 h-6 text-[rgb(var(--muted))]" />
                        <div className="text-center">
                          <div className="text-xs font-medium text-[rgb(var(--text))]">
                            {selectedItemImageFile ? selectedItemImageFile.name : 'Click to upload image'}
                          </div>
                          <div className="text-xs text-[rgb(var(--muted))] mt-0.5">PNG, JPG, WebP · Max 5MB</div>
                        </div>
                        <input type="file" accept="image/*" onChange={handleItemImageFileChange} className="hidden" />
                      </label>
                      {itemImagePreview && (
                        <div className="relative rounded-xl overflow-hidden border border-[rgb(var(--border))] aspect-video">
                          <img src={itemImagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setItemImagePreview(null); setSelectedItemImageFile(null); }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[rgb(var(--text))]">Order Index</label>
                      <input type="number" value={itemForm.order_index} onChange={(e) => setItemForm({ ...itemForm, order_index: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                        placeholder="0" />
                      <p className="text-xs text-[rgb(var(--muted))]">Lower numbers appear first</p>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={itemForm.is_published} onChange={(e) => setItemForm({ ...itemForm, is_published: e.target.checked })} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[rgb(var(--border))] rounded-full peer peer-checked:bg-[rgb(var(--primary))] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                      <span className="text-sm font-semibold text-[rgb(var(--text))]">Published</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[rgb(var(--text))]">Description</label>
                    <textarea rows={3} value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all resize-none"
                      placeholder="Description..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[rgb(var(--text))]">Custom Fields (JSON)</label>
                    <textarea rows={4} value={itemForm.custom_fields} onChange={(e) => setItemForm({ ...itemForm, custom_fields: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--elevated))] text-[rgb(var(--text))] text-sm font-mono outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all resize-none"
                      placeholder='{"link": "/products", "buttonText": "Shop Now"}' />
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-[rgb(var(--border))]">
                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[rgb(var(--primary))] text-white font-bold text-sm hover:opacity-90 transition-all">
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button type="button" onClick={() => { setShowAddItem(false); setEditingItem(null); }}
                      className="px-6 py-3 rounded-xl border border-[rgb(var(--border))] text-[rgb(var(--text))] text-sm font-semibold hover:bg-[rgb(var(--elevated))] transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {websiteItems.map(item => (
                <div key={item.id} className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
                  {item.image_url && (
                    <div className="aspect-video overflow-hidden bg-[rgb(var(--elevated))]">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold border', item.is_published ? 'bg-green-100 text-green-700 border-green-200' : 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))] border-[rgb(var(--border))]')}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]">
                        {item.item_type}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[rgb(var(--text))]">{item.title}</h3>
                      {item.description && <p className="text-xs text-[rgb(var(--muted))] mt-0.5 line-clamp-2">{item.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditItem(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[rgb(var(--border))] text-[rgb(var(--text))] text-xs font-semibold hover:bg-[rgb(var(--elevated))] transition-all">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {websiteItems.length === 0 && (
                <div className="col-span-full text-center py-20 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl">
                  <Monitor className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--muted))]/40" />
                  <h3 className="font-bold text-[rgb(var(--text))]">No website items yet</h3>
                  <p className="text-sm text-[rgb(var(--muted))] mt-1">Click &ldquo;Add Item&rdquo; to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

>>>>>>> d4b4a93 (update code)
      </div>
    </main>
  );
}
<<<<<<< HEAD
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
=======
>>>>>>> d4b4a93 (update code)
