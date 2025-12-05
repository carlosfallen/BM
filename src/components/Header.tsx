import { createSignal, Show, For } from 'solid-js';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Produtos', href: '/produtos' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [isScrolled, setIsScrolled] = createSignal(false);

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled()
          ? 'bg-white shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Top Bar */}
      <div class="bg-primary-600 text-white py-2">
        <div class="container-custom">
          <div class="flex justify-between items-center text-sm">
            <div class="flex items-center gap-6">
              <a href="tel:+5519971477055" class="flex items-center gap-2 hover:text-primary-200 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(19) 97147-7055</span>
              </a>
              <a href="mailto:bmpecasdiesel@gmail.com" class="hidden md:flex items-center gap-2 hover:text-primary-200 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>bmpecasdiesel@gmail.com</span>
              </a>
            </div>
            <a
              href="https://www.instagram.com/bmpecasdiesel/"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden md:flex items-center gap-2 hover:text-primary-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>@bmpecasdiesel</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div class="container-custom">
        <nav class="flex items-center justify-between">
          {/* Logo */}
          <a href="/" class="flex items-center space-x-2 group">
            <div class="text-2xl md:text-3xl font-bold">
              <span class={isScrolled() ? 'text-primary-600' : 'text-white'}>BM</span>
              <span class={isScrolled() ? 'text-gray-900' : 'text-white'}> Peças Diesel</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div class="hidden lg:flex items-center space-x-8">
            <For each={navLinks}>
              {(link) => (
                <a
                  href={link.href}
                  class={`font-medium transition-colors ${
                    isScrolled()
                      ? 'text-gray-700 hover:text-primary-600'
                      : 'text-white hover:text-primary-200'
                  }`}
                >
                  {link.label}
                </a>
              )}
            </For>
            <a
              href="/contato"
              class="btn btn-primary"
            >
              Fale Conosco
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen())}
            class={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled()
                ? 'text-gray-900 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            <Show
              when={!isMenuOpen()}
              fallback={
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Show>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <Show when={isMenuOpen()}>
        <div class="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-down">
          <div class="container-custom py-6">
            <div class="flex flex-col space-y-4">
              <For each={navLinks}>
                {(link) => (
                  <a
                    href={link.href}
                    class="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )}
              </For>
              <a
                href="/contato"
                class="btn btn-primary w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </Show>
    </header>
  );
}
