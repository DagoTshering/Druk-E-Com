import { ProductSummary } from '../components/ProductSummary';
import type { Category } from '@/apis/productsApi';
import type { ProductFormState } from '../utils/types';

interface ReviewStepProps {
  state: ProductFormState;
  categories: Category[];
  submit: () => Promise<boolean>;
}

export function ReviewStep({ state, categories, submit }: ReviewStepProps) {
  const handleSubmit = async () => {
    await submit();
  };

  return (
    <div className="space-y-6">
      <ProductSummary state={state} categories={categories} />

      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={state.isSubmitting}
          className="px-8 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isSubmitting ? 'Submitting...' : 'Submit Product'}
        </button>
      </div>
    </div>
  );
}
