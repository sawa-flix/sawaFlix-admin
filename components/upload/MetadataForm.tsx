import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';

const metadataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  language: z.enum(['English', 'French', 'Pidgin', 'Camfranglais', 'Local Dialect'], {
    message: 'Please select a valid language'
  }),
  visibility: z.enum(['Public', 'Unlisted', 'Private']),
  age_restriction: z.boolean(),
  is_reel: z.boolean().optional(),
  tags: z.array(z.string()).max(10, 'Maximum of 10 tags allowed')
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
      is_reel: initialData.is_reel || false,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs text-left">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
        
        {/* Video Title */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Video Title *</label>
            <span className="text-[11px] text-slate-400 font-mono">{watch('title')?.length || 0}/100</span>
          </div>
          <input
            type="text"
            placeholder="Enter a descriptive title"
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.title ? 'border-rose-400 ring-1 ring-rose-400/20' : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10'
            } bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all`}
            {...register('title')}
          />
          {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="w-full mt-5">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <span className="text-[11px] text-slate-400 font-mono">{watch('description')?.length || 0}/1000</span>
          </div>
          <textarea
            rows={4}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.description ? 'border-rose-400 ring-1 ring-rose-400/20' : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10'
            } bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all resize-y`}
            placeholder="Tell viewers about your video..."
            {...register('description')}
          ></textarea>
          {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Language & Visibility Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Language *</label>
            <select 
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.language ? 'border-rose-400' : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10'
              } bg-white text-slate-900 text-sm focus:outline-none transition-all cursor-pointer`}
              {...register('language')}
            >
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Pidgin">Pidgin</option>
              <option value="Camfranglais">Camfranglais</option>
              <option value="Local Dialect">Local Dialect</option>
            </select>
            {errors.language && <p className="text-rose-500 text-xs mt-1">{errors.language.message}</p>}
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Visibility *</label>
            <select 
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all cursor-pointer"
              {...register('visibility')}
            >
              <option value="Public">Public</option>
              <option value="Unlisted">Unlisted</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>

        {/* Age Restriction Toggle */}
        <div className="w-full mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-900">Age Restriction (18+)</span>
            <p className="text-xs text-slate-500 mt-0.5">Enable this if the content is only suitable for mature audiences.</p>
          </div>
          <Controller
            name="age_restriction"
            control={control}
            render={({ field }) => (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            )}
          />
        </div>

        {/* Is Reel / Short Video Toggle */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Is Reel / Short Video?</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Reel / Shorts</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Enable if video is to be published as reel on the user feed.</p>
          </div>
          <Controller
            name="is_reel"
            control={control}
            render={({ field }) => (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={field.onChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            )}
          />
        </div>

        {/* Tags */}
        <div className="w-full mt-5">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Tags (Max 10)</label>
            <span className="text-[11px] text-slate-400 font-mono">{tags.length}/10</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              disabled={tags.length >= 10}
            />
            <button 
              type="button" 
              onClick={handleAddTag}
              disabled={tags.length >= 10 || !tagInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
          {errors.tags && <p className="text-rose-500 text-xs mt-1">{errors.tags.message}</p>}
          
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <div key={tag} className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-150 border border-slate-200/80 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl transition-colors">
                <span>{tag}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-slate-700 rounded-full p-0.5 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            {tags.length === 0 && (
              <span className="text-xs text-slate-400 italic py-1">No tags added yet.</span>
            )}
          </div>
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button 
          type="button" 
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          onClick={onBack}
        >
          ← Back to File
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
          disabled={!isValid}
        >
          Continue to Category →
        </button>
      </div>
    </form>
  );
};
