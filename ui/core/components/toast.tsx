import { Toast as BootstrapToast } from 'bootstrap';

type ToastOptions = {
	title?: string;
	variant: 'info' | 'success' | 'error';
	body: string | Element;
	autoShow?: boolean;
} & Partial<BootstrapToast.Options>;

class Toast {
	private element: HTMLElement;
	private container: HTMLElement;
	private title: ToastOptions['title'];
	private body: ToastOptions['body'];
	private variant: ToastOptions['variant'];

	public instance;
	constructor(options: ToastOptions) {
		const { title, variant, autoShow = true, body, ...bootstrapOptions } = options || {};
		this.container = document.getElementById('toastContainer')!;
		this.title = title || 'WowSims';
		this.variant = variant || 'info';
		this.body = body;

		this.element = this.template();
		this.container.appendChild(this.element);

		this.instance = BootstrapToast.getOrCreateInstance(this.element, {
			delay: 3000,
			...bootstrapOptions,
		});

		if (autoShow) this.instance.show();

		this.element.addEventListener('hidden.bs.toast', () => {
			this.destroy();
		});
	}

	destroy() {
		this.instance.dispose();
		this.element.remove();
	}

	show() {
		this.instance.show();
	}

	hide() {
		this.instance.hide();
	}

	getVariantIcon() {
		switch (this.variant) {
			case 'info':
				return 'fa-info-circle';
			case 'success':
				return 'fa-check-circle';
			case 'error':
				return 'fa-exclamation-circle';
		}
	}

	template() {
		return (
			<div
				className={`toast position-relative bottom-0 end-0 toast--${this.variant}`}
				attributes={{
					role: 'alert',
					'aria-live': 'assertive',
					'aria-atomic': 'true',
				}}>
				<div className="toast-header">
					<i className={`d-block fas fa-2xl me-2 ${this.getVariantIcon()}`}></i>
					<strong className="me-auto">{this.title}</strong>
					<a
						href="javascript:void(0);"
						className="btn-close"
						attributes={{
							role: 'button',
							'aria-label': 'Close',
						}}
						dataset={{
							bsDismiss: 'toast',
						}}
						aria-label="Close">
						<i className={`fas fa-times fa-1xl ${this.getVariantIcon()}`}></i>
					</a>
				</div>
				<div className="toast-body">{this.body}</div>
			</div>
		) as HTMLElement;
	}
}

export default Toast;
