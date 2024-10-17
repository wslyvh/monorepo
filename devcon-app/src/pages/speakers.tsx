import { AppLayout } from 'components/domain/app/Layout'
import { Speakers } from 'components/domain/app/speakers'
import { pageHOC } from 'context/pageHOC'
import React from 'react'
import { useRouter } from 'next/router'
import { Speaker as SpeakerType } from 'types/Speaker'
import {
  fetchSessions,
  fetchRooms,
  fetchTracks,
  fetchEvent,
  fetchExpertiseLevels,
  fetchSessionTypes,
} from 'services/event-data'
import { DEFAULT_APP_PAGE } from 'utils/constants'
import { SpeakerDetails } from 'components/domain/app/speakers'
import { SEO } from 'components/domain/seo'
import { useSpeakersWithSessions } from 'services/event-data'
import { FancyLoader } from 'lib/components/loader/loader'

export default pageHOC((props: any) => {
  const speakers = useSpeakersWithSessions()
  const { query } = useRouter()

  return (
    <AppLayout pageTitle="Speakers" breadcrumbs={[{ label: 'Speakers' }]}>
      <SEO title="Speakers" />

      {speakers &&
        (() => {
          const speakerID = query.speaker
          const speaker = speakers.find((speaker: SpeakerType) => speaker.id === speakerID)

          return speaker ? (
            <>
              <>
                <SEO title={speaker.name} description={speaker.description} separator="@" />
                <SpeakerDetails speaker={speaker} {...props} speakers={speakers} />
              </>
            </>
          ) : (
            <>
              <Speakers {...props} speakers={speakers} />
            </>
          )
        })()}

      <div className="fixed top-0 h-full w-full flex justify-center items-center opacity-100 z-5 pointer-events-none">
        <FancyLoader loading={!speakers} />
      </div>
    </AppLayout>
  )
})

export async function getStaticProps(context: any) {
  // const sessions = await GetSessions()
  // const speakers = await GetSpeakers()

  // const sessionsBySpeakerId: any = {}

  // sessions.forEach(session => {
  //   session.speakers.forEach(speaker => {
  //     if (sessionsBySpeakerId[speaker.id]) {
  //       sessionsBySpeakerId[speaker.id].push(session)
  //     } else {
  //       sessionsBySpeakerId[speaker.id] = [session]
  //     }
  //   })
  // })

  // const speakersWithSessions = speakers.map(speaker => {
  //   return {
  //     ...speaker,
  //     sessions: sessionsBySpeakerId[speaker.id],
  //   }
  // })

  return {
    props: {
      // ...(await getGlobalData(context.locale, true)),
      // sessions,
      page: DEFAULT_APP_PAGE,
      // speakers: speakersWithSessions,
      tracks: await fetchTracks(),
      // eventDays: await fetchEventDays(),
      rooms: await fetchRooms(),
      expertiseLevels: await fetchExpertiseLevels(),
      sessionTypes: await fetchSessionTypes(),
    },
  }
}
