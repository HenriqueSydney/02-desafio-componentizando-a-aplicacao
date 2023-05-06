import { useCallback, useEffect, useState } from 'react'

import { SideBar } from './components/SideBar'
import { Content } from './components/Content'

import { api } from './services/api'

import './styles/global.scss'

import './styles/sidebar.scss'
import './styles/content.scss'

interface GenreResponseProps {
  id: number
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family'
  title: string
}

interface MovieProps {
  imdbID: string
  Title: string
  Poster: string
  Ratings: Array<{
    Source: string
    Value: string
  }>
  Runtime: string
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps,
  )
  const [movies, setMovies] = useState<MovieProps[]>([])
  const [genres, setGenres] = useState<GenreResponseProps[]>([])

  const handleClickButton = useCallback((id: number) => {
    setSelectedGenreId(id)
  }, [])

  useEffect(() => {
    api
      .get<GenreResponseProps>(`genres/${selectedGenreId}`)
      .then((response) => {
        setSelectedGenre(response.data)
      })

    api
      .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
      .then((response) => {
        setMovies(response.data)
      })
  }, [selectedGenreId])

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then((response) => {
      setGenres(response.data)
    })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar
        handleClickButton={handleClickButton}
        selectedGenreId={selectedGenreId}
        genres={genres}
      />
      <Content selectedGenre={selectedGenre} movies={movies} />
    </div>
  )
}
