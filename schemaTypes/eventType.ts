import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import { DoorsOpenInput } from './components/DoorsOpen'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'}
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: ['details', 'editorial'],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      options: {source: 'name'},
      validation: (rule) => rule
        .required()
        .error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.name,
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      group: 'details',
      options: {
        list: [
          'benefit Concert',
          'pub',
          'festival',
          'opera',
          'orchestra',
          'theatre',
          'dance',
          'classical Music',
          'jazz Club',
          'virtual'
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      description: 'Number of minutes before the start time for admission',
      type: 'number',
      group: 'details',  
      initialValue: 45,
      components: {
        input: DoorsOpenInput
      }  
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      group: 'details',
      description: 'Virtual events DO NOT require a venue',
      to: [{type: 'venue'}],
      readOnly: ({value, document}) => !value && document?.eventType === 'virtual',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'virtual') {
            return 'Only in-person events can have a venue'
          }
    
          return true
        }),
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      group: 'details',  
      to: ({ type: 'artist'})
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      group: 'editorial',  
    }),
    defineField({
      name: 'details',
      type: 'array',
      group: 'editorial',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'onlineTicketsURL',
      description: 'Link to the online ticket buying site',
      type: 'url',
      group: 'details',
    })
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'No date'

      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})