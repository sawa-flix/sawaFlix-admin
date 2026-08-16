import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';

const CATEGORIES = ['Culture', 'Music', 'Sport', 'Comedy', 'News', 'Geography/Nature'] as const;

// Launch values from Carol's specs
export const TRIBE_OR_ETHNIC_GROUPS = [
  'Bamiléké',
  'Bamum',
  'Tikar',
  'Nso',
  'Bafut',
  'Kom',
  'Duala',
  'Bassa',
  'Bakweri',
  'Isubu',
  'Oroko',
  'Mungo',
  'Beti',
  'Bulu',
  'Fang',
  'Ewondo',
  'Maka',
  'Njem',
  'Baka',
  'Fulani',
  'Kanuri',
  'Sao',
  'Mafa',
  'Toupouri',
  'Moundang',
  'Massa',
  'Mousgoum',
  'Guiziga',
  'Other (please specify)',
] as const;

export const REGIONS_OF_ORIGIN = [
  'Adamawa',
  'Centre',
  'East',
  'Far North',
  'Littoral',
  'North',
  'Northwest',
  'South',
  'Southwest',
  'West',
] as const;

export const CULTURAL_EVENT_TYPES = [
  'Traditional Dance',
  'Chiefdom Ceremony',
  'Funeral Rite',
  'Festival',
  'Wedding Ceremony',
  'Initiation Rite',
  'Harvest Celebration',
  'Masquerade',
  'Naming Ceremony',
  'Other (please specify)',
] as const;

export const MUSIC_GENRES = [
  'Makossa',
  'Bikutsi',
  'Assiko',
  'Bend-Skin',
  'Mangambeu',
  'Ambasse Bey',
  'Afrobeats',
  'Gospel',
  'Hip-Hop',
  'Njang',
  'R&B',
  'Coupé-Décalé',
  'Other (please specify)',
] as const;

export const SPORT_TYPES = [
  'Football',
  'Basketball',
  'Combat Sports',
  'Athletics',
  'Handball',
  'Volleyball',
  'Traditional Wrestling',
  'Other (please specify)',
] as const;

export const LEAGUES_OR_TOURNAMENTS = [
  'MTN Elite One',
  'MTN Elite Two',
  'Cameroon Cup',
  'AFCON',
  'CHAN',
  'CAF Champions League',
  'CAF Confederation Cup',
  'Regional Leagues',
  'Other (please specify)',
] as const;

export const COMEDY_STYLES = [
  'Stand-up',
  'Skit',
  'Prank',
  'Improvisation',
  'Satire',
  'Other (please specify)',
] as const;

export const NEWS_CATEGORIES = [
  'Politics',
  'Economy',
  'Society',
  'Health',
  'Education',
  'Sports',
  'Culture',
  'Other (please specify)',
] as const;

export const TERRAIN_TYPES = [
  'Mountain',
  'Forest',
  'Savannah',
  'Coast',
  'Volcanic',
  'Wetland',
  'Other (please specify)',
] as const;

const cultureSchema = z.object({
  category: z.literal('Culture'),
  tribe_or_ethnic_group: z.enum(TRIBE_OR_ETHNIC_GROUPS, { message: 'Required' }),
  tribe_or_ethnic_group_other: z.string().optional(),
  region_of_origin: z.enum(REGIONS_OF_ORIGIN, { message: 'Required' }),
  cultural_event_type: z.enum(CULTURAL_EVENT_TYPES, { message: 'Required' }),
  cultural_event_type_other: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.tribe_or_ethnic_group === 'Other (please specify)' && !data.tribe_or_ethnic_group_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the tribe or ethnic group',
      path: ['tribe_or_ethnic_group_other'],
    });
  }
  if (data.cultural_event_type === 'Other (please specify)' && !data.cultural_event_type_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the cultural event type',
      path: ['cultural_event_type_other'],
    });
  }
});

const musicSchema = z.object({
  category: z.literal('Music'),
  artist_name: z.string().min(1, 'Required'),
  featured_artists: z.array(z.string()).default([]),
  music_genre: z.enum(MUSIC_GENRES, { message: 'Required' }),
  music_genre_other: z.string().optional(),
  producer: z.string().optional(),
  release_year: z.coerce.number().min(1900).max(2100).optional(),
}).superRefine((data, ctx) => {
  if (data.music_genre === 'Other (please specify)' && !data.music_genre_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the music genre',
      path: ['music_genre_other'],
    });
  }
});

const sportSchema = z.object({
  category: z.literal('Sport'),
  sport_type: z.enum(SPORT_TYPES, { message: 'Required' }),
  sport_type_other: z.string().optional(),
  home_team: z.string().min(1, 'Required'),
  away_team: z.string().min(1, 'Required'),
  league_or_tournament: z.enum(LEAGUES_OR_TOURNAMENTS, { message: 'Required' }),
  league_or_tournament_other: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.sport_type === 'Other (please specify)' && !data.sport_type_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the sport type',
      path: ['sport_type_other'],
    });
  }
  if (data.league_or_tournament === 'Other (please specify)' && !data.league_or_tournament_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the league or tournament',
      path: ['league_or_tournament_other'],
    });
  }
});

const comedySchema = z.object({
  category: z.literal('Comedy'),
  comedian_name: z.string().min(1, 'Required'),
  comedy_style: z.enum(COMEDY_STYLES, { message: 'Required' }),
  comedy_style_other: z.string().optional(),
  primary_spoken_language: z.string().min(1, 'Required'),
}).superRefine((data, ctx) => {
  if (data.comedy_style === 'Other (please specify)' && !data.comedy_style_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the comedy style',
      path: ['comedy_style_other'],
    });
  }
});

const newsSchema = z.object({
  category: z.literal('News'),
  news_category: z.enum(NEWS_CATEGORIES, { message: 'Required' }),
  news_category_other: z.string().optional(),
  reporting_region: z.string().min(1, 'Required'),
  journalist_name: z.string().optional(),
  broadcast_date: z.string().min(1, 'Required'),
}).superRefine((data, ctx) => {
  if (data.news_category === 'Other (please specify)' && !data.news_category_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the news category',
      path: ['news_category_other'],
    });
  }
});

const natureSchema = z.object({
  category: z.literal('Geography/Nature'),
  location_name: z.string().min(1, 'Required'),
  terrain_type: z.enum(TERRAIN_TYPES, { message: 'Required' }),
  terrain_type_other: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.terrain_type === 'Other (please specify)' && !data.terrain_type_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the terrain type',
      path: ['terrain_type_other'],
    });
  }
});

const categorySchema = z.discriminatedUnion('category', [
  cultureSchema,
  musicSchema,
  sportSchema,
  comedySchema,
  newsSchema,
  natureSchema,
]);

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFieldsProps {
  initialData: Partial<CategoryFormData>;
  onNext: (data: CategoryFormData) => void;
  onBack: () => void;
}

export const CategoryFields: React.FC<CategoryFieldsProps> = ({ initialData, onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<any>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData.category ? initialData : { category: 'Culture' },
    mode: 'onChange'
  });

  const selectedCategory = watch('category');
  const watchAllFields = watch();

  const [featuredArtistInput, setFeaturedArtistInput] = useState('');
  const featuredArtists = watch('featured_artists') as string[] || [];

  // When category changes, reset fields but keep the new category
  useEffect(() => {
    if (initialData.category !== selectedCategory) {
       // Reset form to base state of the new category to clear previous errors
       reset({ category: selectedCategory });
    }
  }, [selectedCategory, reset, initialData.category]);

  const handleAddArtist = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    
    const trimmed = featuredArtistInput.trim();
    if (trimmed && !featuredArtists.includes(trimmed)) {
      setValue('featured_artists', [...featuredArtists, trimmed], { shouldValidate: true });
      setFeaturedArtistInput('');
    }
  };

  const handleRemoveArtist = (artistToRemove: string) => {
    setValue('featured_artists', featuredArtists.filter(a => a !== artistToRemove), { shouldValidate: true });
  };

  const onSubmit = (data: any) => {
    onNext(data as CategoryFormData);
  };

  const renderDynamicFields = () => {
    switch (selectedCategory) {
      case 'Culture':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Tribe or Ethnic Group *</span></label>
              <select className={`select select-bordered ${(errors as any).tribe_or_ethnic_group ? 'select-error' : ''}`} {...register('tribe_or_ethnic_group' as any)}>
                <option value="">Select Tribe...</option>
                {TRIBE_OR_ETHNIC_GROUPS.map((tribe) => (
                  <option key={tribe} value={tribe}>{tribe}</option>
                ))}
              </select>
              {(watchAllFields as any).tribe_or_ethnic_group === 'Other (please specify)' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Specify tribe or ethnic group *"
                    className={`input input-bordered w-full ${(errors as any).tribe_or_ethnic_group_other ? 'input-error' : ''}`}
                    {...register('tribe_or_ethnic_group_other' as any)}
                  />
                  {(errors as any).tribe_or_ethnic_group_other?.message && (
                    <p className="text-error text-xs mt-1">{(errors as any).tribe_or_ethnic_group_other.message as string}</p>
                  )}
                </div>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Region of Origin *</span></label>
              <select className={`select select-bordered ${(errors as any).region_of_origin ? 'select-error' : ''}`} {...register('region_of_origin' as any)}>
                <option value="">Select Region...</option>
                {REGIONS_OF_ORIGIN.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Cultural Event Type *</span></label>
              <select className={`select select-bordered ${(errors as any).cultural_event_type ? 'select-error' : ''}`} {...register('cultural_event_type' as any)}>
                <option value="">Select Event Type...</option>
                {CULTURAL_EVENT_TYPES.map((event) => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
              {(watchAllFields as any).cultural_event_type === 'Other (please specify)' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Specify cultural event type *"
                    className={`input input-bordered w-full ${(errors as any).cultural_event_type_other ? 'input-error' : ''}`}
                    {...register('cultural_event_type_other' as any)}
                  />
                  {(errors as any).cultural_event_type_other?.message && (
                    <p className="text-error text-xs mt-1">{(errors as any).cultural_event_type_other.message as string}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'Music':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Artist Name *</span></label>
              <input type="text" className={`input input-bordered ${(errors as any).artist_name ? 'input-error' : ''}`} {...register('artist_name' as any)} />
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Music Genre *</span></label>
              <select className={`select select-bordered ${(errors as any).music_genre ? 'select-error' : ''}`} {...register('music_genre' as any)}>
                <option value="">Select Genre...</option>
                {MUSIC_GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              {(watchAllFields as any).music_genre === 'Other (please specify)' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Specify music genre *"
                    className={`input input-bordered w-full ${(errors as any).music_genre_other ? 'input-error' : ''}`}
                    {...register('music_genre_other' as any)}
                  />
                  {(errors as any).music_genre_other?.message && (
                    <p className="text-error text-xs mt-1">{(errors as any).music_genre_other.message as string}</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Producer</span></label>
                <input type="text" className="input input-bordered" {...register('producer' as any)} />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Release Year</span></label>
                <input type="number" className="input input-bordered" {...register('release_year' as any)} />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Featured Artists</span></label>
              <div className="flex gap-2">
                <input type="text" placeholder="Add artist..." className="input input-bordered w-full" value={featuredArtistInput} onChange={(e) => setFeaturedArtistInput(e.target.value)} onKeyDown={handleAddArtist} />
                <button type="button" onClick={handleAddArtist} className="btn btn-secondary"><Plus size={20}/></button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {featuredArtists.map((artist: string) => (
                  <div key={artist} className="badge badge-primary gap-1 p-3">
                    {artist}
                    <button type="button" onClick={() => handleRemoveArtist(artist)} className="hover:text-error"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Sport':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Sport Type *</span></label>
              <select className={`select select-bordered ${(errors as any).sport_type ? 'select-error' : ''}`} {...register('sport_type' as any)}>
                <option value="">Select Sport...</option>
                {SPORT_TYPES.map((sport) => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
              {(watchAllFields as any).sport_type === 'Other (please specify)' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Specify sport type *"
                    className={`input input-bordered w-full ${(errors as any).sport_type_other ? 'input-error' : ''}`}
                    {...register('sport_type_other' as any)}
                  />
                  {(errors as any).sport_type_other?.message && (
                    <p className="text-error text-xs mt-1">{(errors as any).sport_type_other.message as string}</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Home Team *</span></label>
                <input type="text" className={`input input-bordered ${(errors as any).home_team ? 'input-error' : ''}`} {...register('home_team' as any)} />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Away Team *</span></label>
                <input type="text" className={`input input-bordered ${(errors as any).away_team ? 'input-error' : ''}`} {...register('away_team' as any)} />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">League or Tournament *</span></label>
              <select className={`select select-bordered ${(errors as any).league_or_tournament ? 'select-error' : ''}`} {...register('league_or_tournament' as any)}>
                <option value="">Select League...</option>
                {LEAGUES_OR_TOURNAMENTS.map((league) => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </select>
              {(watchAllFields as any).league_or_tournament === 'Other (please specify)' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Specify league or tournament *"
                    className={`input input-bordered w-full ${(errors as any).league_or_tournament_other ? 'input-error' : ''}`}
                    {...register('league_or_tournament_other' as any)}
                  />
                  {(errors as any).league_or_tournament_other?.message && (
                    <p className="text-error text-xs mt-1">{(errors as any).league_or_tournament_other.message as string}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'Comedy':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Comedian Name *</span></label>
              <input type="text" className={`input input-bordered ${(errors as any).comedian_name ? 'input-error' : ''}`} {...register('comedian_name' as any)} />
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Comedy Style *</span></label>
              <select className={`select select-bordered ${(errors as any).comedy_style ? 'select-error' : ''}`} {...register('comedy_style' as any)}>
                <option value="">Select Style...</option>
                {COMEDY_STYLES.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              {(watchAllFields as any).comedy_style === 'Other (please specify)' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Specify comedy style *"
                    className={`input input-bordered w-full ${(errors as any).comedy_style_other ? 'input-error' : ''}`}
                    {...register('comedy_style_other' as any)}
                  />
                  {(errors as any).comedy_style_other?.message && (
                    <p className="text-error text-xs mt-1">{(errors as any).comedy_style_other.message as string}</p>
                  )}
                </div>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Primary Spoken Language *</span></label>
              <select className={`select select-bordered ${(errors as any).primary_spoken_language ? 'select-error' : ''}`} {...register('primary_spoken_language' as any)}>
                <option value="">Select Language...</option>
                <option value="Pidgin">Pidgin</option>
                <option value="French">French</option>
                <option value="English">English</option>
                <option value="Camfranglais">Camfranglais</option>
              </select>
            </div>
          </div>
        );

      case 'News':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">News Category *</span></label>
              <select className={`select select-bordered ${(errors as any).news_category ? 'select-error' : ''}`} {...register('news_category' as any)}>
                <option value="">Select Category...</option>
                {NEWS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {(watchAllFields as any).news_category === 'Other (please specify)' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Specify news category *"
                    className={`input input-bordered w-full ${(errors as any).news_category_other ? 'input-error' : ''}`}
                    {...register('news_category_other' as any)}
                  />
                  {(errors as any).news_category_other?.message && (
                    <p className="text-error text-xs mt-1">{(errors as any).news_category_other.message as string}</p>
                  )}
                </div>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Reporting Region *</span></label>
              <input type="text" className={`input input-bordered ${(errors as any).reporting_region ? 'input-error' : ''}`} {...register('reporting_region' as any)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Journalist Name</span></label>
                <input type="text" className="input input-bordered" {...register('journalist_name' as any)} />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Broadcast Date *</span></label>
                <input type="date" className={`input input-bordered ${(errors as any).broadcast_date ? 'input-error' : ''}`} {...register('broadcast_date' as any)} />
              </div>
            </div>
          </div>
        );

      case 'Geography/Nature':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Location Name *</span></label>
              <input
                type="text"
                className={`input input-bordered ${(errors as any).location_name ? 'input-error' : ''}`}
                {...register('location_name' as any)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Terrain Type *</span></label>
              <select className={`select select-bordered ${(errors as any).terrain_type ? 'select-error' : ''}`} {...register('terrain_type' as any)}>
                <option value="">Select Terrain...</option>
                {TERRAIN_TYPES.map((terrain) => (
                  <option key={terrain} value={terrain}>{terrain}</option>
                ))}
              </select>
              {(watchAllFields as any).terrain_type === 'Other (please specify)' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Specify terrain type *"
                    className={`input input-bordered w-full ${(errors as any).terrain_type_other ? 'input-error' : ''}`}
                    {...register('terrain_type_other' as any)}
                  />
                  {(errors as any).terrain_type_other?.message && (
                    <p className="text-error text-xs mt-1">{(errors as any).terrain_type_other.message as string}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="card bg-base-100 border border-base-content/10 shadow-sm text-left">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Category Specifics</h2>
          
          <div className="form-control w-full mb-6 pb-6 border-b border-base-content/10">
            <label className="label">
              <span className="label-text font-medium text-lg">Select Content Category *</span>
            </label>
            <select 
              className="select select-bordered select-lg w-full focus:select-primary"
              {...register('category')}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="min-h-[250px]">
             {renderDynamicFields()}
          </div>
          
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Back to Basic Info
        </button>
        <button type="submit" className="btn btn-primary px-10" disabled={!isValid}>
          Continue to Review
        </button>
      </div>
    </form>
  );
};

