import { useCallback, useMemo, useState } from 'react';
import { ShopContext } from './shop-context';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { getEffectivePrice } from '../lib/product-utils';
import { useToast } from '../components/Toast';

const STORAGE_KEYS = {
  cart: 'cart',
  recentlyViewed: 'recentlyViewed',
  wishlist: 'wishlist',
};

function getVariantId(variant) {
  return variant?.id || 'default';
}

function isSameCartItem(item, productId, variantId) {
  return item.product.id === productId && getVariantId(item.variant) === getVariantId({ id: variantId });
}

export function ShopProvider({ children }) {
  const addToast = useToast();
  const [cart, setCart] = useLocalStorageState(STORAGE_KEYS.cart, []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorageState(STORAGE_KEYS.recentlyViewed, []);
  const [wishlist, setWishlist] = useLocalStorageState(STORAGE_KEYS.wishlist, []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product, variant, quantity = 1) => {
    setCart((currentCart) => {
      const variantId = getVariantId(variant);
      const existingItem = currentCart.find((item) => isSameCartItem(item, product.id, variantId));

      if (!existingItem) {
        return [...currentCart, { product, variant, quantity }];
      }

      return currentCart.map((item) =>
        isSameCartItem(item, product.id, variantId)
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    });

    setIsCartOpen(true);
    addToast(`${product.name} added to cart`, 'cart');
  }, [setCart, addToast]);

  const removeFromCart = useCallback((productId, variantId) => {
    setCart((currentCart) => currentCart.filter((item) => !isSameCartItem(item, productId, variantId)));
  }, [setCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  const addRecentlyViewed = useCallback((product) => {
    setRecentlyViewed((currentItems) => {
      const itemsWithoutCurrentProduct = currentItems.filter((item) => item.id !== product.id);
      return [product, ...itemsWithoutCurrentProduct].slice(0, 8);
    });
  }, [setRecentlyViewed]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) {
        addToast(`${product.name} removed from wishlist`, 'wishlist');
        return current.filter((item) => item.id !== product.id);
      }
      addToast(`${product.name} added to wishlist`, 'wishlist');
      return [...current, product];
    });
  }, [setWishlist, addToast]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  const [theme, setTheme] = useLocalStorageState('theme', 'dark');
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const [compareList, setCompareList] = useLocalStorageState('compareList', []);
  const toggleCompare = useCallback((product) => {
    setCompareList((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) return current.filter((item) => item.id !== product.id);
      if (current.length >= 4) return current;
      return [...current, product];
    });
  }, [setCompareList]);
  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, [setCompareList]);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + getEffectivePrice(item.product) * item.quantity, 0), [cart]);

  const value = useMemo(() => ({
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    recentlyViewed,
    addRecentlyViewed,
    wishlist,
    toggleWishlist,
    isInWishlist,
    theme,
    toggleTheme,
    compareList,
    toggleCompare,
    clearCompare,
    isCartOpen,
    setIsCartOpen,
  }), [
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    recentlyViewed,
    addRecentlyViewed,
    wishlist,
    toggleWishlist,
    isInWishlist,
    theme,
    toggleTheme,
    compareList,
    toggleCompare,
    clearCompare,
    isCartOpen,
  ]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
