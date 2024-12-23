type ToastType = 'success' | 'error' | 'info';

class Toast {
  private createToast(message: string, type: ToastType) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white transform transition-all duration-300 ease-in-out z-50 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      'bg-gray-800'
    }`;
    toast.textContent = message;

    // Add to DOM
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Remove after delay
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(1rem)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  success(message: string) {
    this.createToast(message, 'success');
  }

  error(message: string) {
    this.createToast(message, 'error');
  }

  info(message: string) {
    this.createToast(message, 'info');
  }
}

export const toast = new Toast();