import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';

const metadataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  language: z.enum(['English', 'French', 'Pidgin', 'Camfranglais', 'Local Dialect'], {
    errorMap: () => ({ message: 'Please select a valid language' })
  }),
  visibility: z.enum(['Public', 'Unlisted', 'Private']),
  age_restriction: z.boolean().default(false),
  tags: z.array(z.string()).max(10, 'Maximum of 10 tags allowed').default([])
});

export type MetadataFormData = z.infer<typeof metadataSchema>;

interface MetadataFormProps {
  initialData: Partial<MetadataFormData>;
  onNext: (data: MetadataFormData) => void;
  onBack: () => void;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({ initialData, onNext, onBack }) => {
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      language: initialData.language || 'English',
      visibility: initialData.visibility || 'Public',
      age_restriction: initialData.age_restriction || false,
      tags: initialData.tags || [],
    },
    mode: 'onChange'
  });

  const tags = watch('tags');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    // allow adding on Enter key or button click
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    
    const trimmedTag = tagInput.trim();
    if (trimmedTag && tags.length < 10 && !tags.includes(trimmedTag)) {
      setValue('tags', [...tags, trimmedTag], { shouldValidate: true });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove), { shouldValidate: true });
  };

  const onSubmit = (data: MetadataFormData) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="card bg-base-100 border border-base-content/10 shadow-sm text-left">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Basic Information</h2>
          
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Video Title *</span>
              <span className="label-text-alt text-base-content/50">{watch('title')?.length || 0}/100</span>
            </label>
            <input
              type="text"
              placeholder="Enter a descriptive title"
              className={`input input-bordered w-full ${errors.title ? 'input-error' : 'focus:input-primary'}`}
              {...register('title')}
            />
            {errors.title && <span className="label-text-alt text-error mt-1">{errors.title.message}</span>}
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text font-medium">Description</span>
              <span className="label-text-alt text-base-content/50">{watch('description')?.length || 0}/1000</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-28 w-full ${errors.description ? 'textarea-error' : 'focus:textarea-primary'}`}
              placeholder="Tell viewers about your video..."
              {...register('description')}
            ></textarea>
            {errors.description && <span className="label-text-alt text-error mt-1">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Primary Language *</span>
              </label>
              <select 
                className={`select select-bordered w-full ${errors.language ? 'select-error' : 'focus:select-primary'}`}
                {...register('language')}
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Pidgin">Pidgin</option>
                <option value="Camfranglais">Camfranglais</option>
                <option value="Local Dialect">Local Dialect</option>
              </select>
              {errors.language && <span className="label-text-alt text-error mt-1">{errors.language.message}</span>}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Visibility *</span>
              </label>
              <select 
                className="select select-bordered w-full focus:select-primary"
                {...register('visibility')}
              >
                <option value="Public">Public</option>
                <option value="Unlisted">Unlisted</option>
                <option value="Private">Private</option>
              </select>
            </div>
          </div>

          <div className="form-control w-full mt-4 p-5 bg-base-200/50 rounded-2xl border border-base-content/5">
            <label className="label cursor-pointer justify-start gap-5">
              <Controller
                name="age_restriction"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    className="toggle toggle-error toggle-lg"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <div>
                <span className="label-text font-bold text-lg">Age Restriction (18+)</span>
                <p className="text-sm text-base-content/60 mt-1">Enable this if the content is only suitable for mature audiences.</p>
              </div>
            </label>
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text font-medium">Tags (Max 10)</span>
              <span className="label-text-alt text-base-content/50">{tags.length}/10</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag..."
                className="input input-bordered w-full focus:input-primary"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                disabled={tags.length >= 10}
              />
              <button 
                type="button" 
                onClick={handleAddTag}
                disabled={tags.length >= 10 || !tagInput.trim()}
                className="btn btn-secondary"
              >
                <Plus size={20} /> Add
              </button>
            </div>
            {errors.tags && <span className="label-text-alt text-error mt-1">{errors.tags.message}</span>}
            
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <div key={tag} className="badge badge-neutral badge-lg gap-2 pl-3 py-4 shadow-sm animate-in fade-in zoom-in">
                  <span className="font-medium">{tag}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-error hover:text-error-content rounded-full p-1 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {tags.length === 0 && (
                <span className="text-sm text-base-content/40 italic py-2">No tags added yet.</span>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Back to File
        </button>
        <button type="submit" className="btn btn-primary px-10" disabled={!isValid}>
          Continue to Category
        </button>
      </div>
    </form>
  );
};
