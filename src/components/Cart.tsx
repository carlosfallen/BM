import { createSignal, createEffect, For, Show } from 'solid-js';
import type { CartItem } from '../types';
import { formatPrice } from '../lib/utils';

export default function Cart() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [cart, setCart] = createSignal<CartItem[]>([]);

  // Load cart from localStorage
  createEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('bm-cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error loading cart:', e);
        }
      }
    }
  });

  // Save cart to localStorage whenever it changes
  createEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bm-cart', JSON.stringify(cart()));
    }
  });

  // Listen for custom events to add items to cart
  createEffect(() => {
    if (typeof window !== 'undefined') {
      const handleAddToCart = (event: CustomEvent) => {
        const item = event.detail;
        const existingItem = cart().find(i => i.productId === item.productId);

        if (existingItem) {
          setCart(cart().map(i =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ));
        } else {
          setCart([...cart(), item]);
        }

        setIsOpen(true);
      };

      window.addEventListener('addToCart' as any, handleAddToCart);
      return () => window.removeEventListener('addToCart' as any, handleAddToCart);
    }
  });

  const removeItem = (productId: number) => {
    setCart(cart().filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCart(cart().map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const total = () => {
    return cart().reduce((sum, item) => {
      const price = item.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const itemCount = () => cart().reduce((sum, item) => sum + item.quantity, 0);

  const clearCart = () => {
    setCart([]);
    setIsOpen(false);
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen())}
        class="fixed bottom-24 right-6 z-40 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110"
        title="Carrinho"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <Show when={itemCount() > 0}>
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {itemCount()}
          </span>
        </Show>
      </button>

      {/* Cart Sidebar */}
      <Show when={isOpen()}>
        <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
          {/* Backdrop */}
          <div
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar */}
          <div class="relative bg-white w-full sm:w-96 h-full sm:h-auto sm:max-h-screen flex flex-col shadow-2xl">
            {/* Header */}
            <div class="flex items-center justify-between p-6 border-b">
              <h2 class="text-2xl font-bold text-gray-900">
                Carrinho ({itemCount()})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div class="flex-1 overflow-y-auto p-6">
              <Show
                when={cart().length > 0}
                fallback={
                  <div class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <p class="text-gray-600">Seu carrinho está vazio</p>
                  </div>
                }
              >
                <div class="space-y-4">
                  <For each={cart()}>
                    {(item) => (
                      <div class="flex gap-4 border-b pb-4">
                        <div class="flex-1">
                          <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          {item.price && (
                            <p class="text-primary-600 font-bold">
                              {formatPrice(item.price)}
                            </p>
                          )}
                          <div class="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span class="w-12 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          class="text-red-500 hover:text-red-700"
                          title="Remover"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>

            {/* Footer */}
            <Show when={cart().length > 0}>
              <div class="border-t p-6 space-y-4">
                <div class="flex items-center justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span class="text-primary-600">{formatPrice(total())}</span>
                </div>
                <div class="space-y-2">
                  <a
                    href="/checkout"
                    class="btn btn-primary w-full text-center text-lg"
                  >
                    Finalizar Pedido
                  </a>
                  <button
                    onClick={clearCart}
                    class="btn bg-gray-200 hover:bg-gray-300 text-gray-700 w-full text-sm"
                  >
                    Limpar Carrinho
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </>
  );
}
