// ============================================================================
// SELLER - MULTI-STEP PRODUCT CREATION WIZARD
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { productsApi, type Category } from '@/apis/productsApi';
import { useProductForm } from './hooks/useProductForm';
import { StepIndicator } from './components/StepIndicator';
import {
  ProductInfoStep,
  VariantsStep,
  ImagesStep,
  ReviewStep,
} from './steps';

export function ProductForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    state,
    updateState,
    nextStep,
    prevStep,
    goToStep,
    canGoToStep,
    setName,
    setDescription,
    setCategoryId,
    setBrand,
    addTag,
    removeTag,
    addVariantAttribute,
    removeVariantAttribute,
    updateVariantAttributeValues,
    generateAllVariants,
    updateVariant,
    deleteVariant,
    uploadProductImages,
    uploadVariantImages,
    removeProductImage,
    removeVariantImage,
    submit,
    isUploading,
  } = useProductForm();

  const fetchCategories = useCallback(async () => {
    try {
      const data: any = await productsApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (): Promise<boolean> => {
    const success = await submit();
    if (success) {
      navigate('/seller/listings');
    }
    return success;
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <ProductInfoStep
            state={state}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            setName={setName}
            setDescription={setDescription}
            setCategoryId={setCategoryId}
            setBrand={setBrand}
            addTag={addTag}
            removeTag={removeTag}
          />
        );
      case 1:
        return (
          <VariantsStep
            state={state}
            addVariantAttribute={addVariantAttribute}
            removeVariantAttribute={removeVariantAttribute}
            updateVariantAttributeValues={updateVariantAttributeValues}
            generateAllVariants={generateAllVariants}
            updateVariant={updateVariant}
            deleteVariant={deleteVariant}
            updateVariantSku={(index, sku) => updateVariant(index, { sku })}
            setHasVariants={(value) => updateState({ hasVariants: value })}
          />
        );
      case 2:
        return (
          <ImagesStep
            state={state}
            uploadProductImages={uploadProductImages}
            uploadVariantImages={uploadVariantImages}
            removeProductImage={removeProductImage}
            removeVariantImage={removeVariantImage}
          />
        );
      case 3:
        return (
          <ReviewStep
            state={state}
            categories={categories}
            submit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = state.currentStep === 3;
  const isFirstStep = state.currentStep === 0;

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/seller/listings"
            className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-warm-gray" />
          </Link>
          <div>
            <h1 className="text-3xl font-display text-warm-white">
              Add New Product
            </h1>
            <p className="text-warm-gray font-body mt-1">
              Create a new product listing for your store
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={state.currentStep}
          completedSteps={state.completedSteps}
          canGoToStep={canGoToStep}
          onStepClick={goToStep}
        />

        {/* Step Content */}
        <div className="bg-dark-surface rounded-xl border border-white/5 p-6 mb-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={isFirstStep}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-body font-medium transition-colors
              ${isFirstStep
                ? 'text-warm-gray/30 cursor-not-allowed'
                : 'text-warm-white border border-white/20 hover:bg-white/5'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {!isLastStep && (
            <button
              type="button"
              onClick={nextStep}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
