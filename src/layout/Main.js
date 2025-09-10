import React from 'react';
import Preloader from '../components/Preloader.js';
import MusicList from '../components/MusicList.js';  // Новый компонент вместо MovieList
import Search from '../components/Search.js';
import './Main.css';

class Main extends React.Component {
    state = { tracks: [], loading: false, type: "all" };

    componentDidMount() {
        // Начальный поиск: треки по "Queen"
        fetch('https://ws.audioscrobbler.com/2.0/?method=track.search&track=Queen&api_key=b4cdbc073401accd6cbd9c94796ca890&format=json')
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
                    this.setState({ tracks: data.results.trackmatches.track });
                }
            })
            .catch(error => console.error('Error fetching initial tracks:', error));
    }

    searchMusic = (str, type = 'all') => {
        this.setState({ loading: true });
        let url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${str.trim()}&api_key=b4cdbc073401accd6cbd9c94796ca890&format=json`;
        
        // Если type !== 'all', можно добавить фильтр (например, для артистов)
        if (type === 'artist') {
            url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${str.trim()}&api_key=b4cdbc073401accd6cbd9c94796ca890&format=json`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
                    this.setState({ tracks: data.results.trackmatches.track, loading: false });
                } else if (data.results && data.results.artistmatches && data.results.artistmatches.artist) {
                    // Для артистов: адаптируй под MusicList
                    this.setState({ tracks: data.results.artistmatches.artist, loading: false });
                } else {
                    this.setState({ tracks: [], loading: false });
                }
            })
            .catch(error => {
                console.error('Error searching music:', error);
                this.setState({ loading: false });
            });
    };

    render() {
        return (
            <div className='main'>
                <div className='wrap'>
                    <Search searchMusic={this.searchMusic} />  {/* Передаём функцию поиска */}
                    {
                        !this.state.loading && this.state.tracks.length ? 
                            <MusicList tracks={this.state.tracks} /> : 
                            <Preloader />
                    }
                </div>
            </div>
        );
    }
}

export default Main;
