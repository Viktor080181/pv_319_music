import React from 'react';
import Preloader from '../components/Preloader.js';
import MusicList from '../components/MusicList.js';
import Search from '../components/Search.js';
import './Main.css';

class Main extends React.Component {
    state = { 
        tracks: [], 
        loading: false, 
        type: "all",
        currentPage: 1,
        searchStr: 'Queen',
        searchType: 'all',
        totalResults: 0,
        totalPages: 0,
    };

    componentDidMount() {
        this.searchMusic('Queen', 'all', 1);
    }

    searchMusic = (str, type = 'all', page = 1) => {
        this.setState({ loading: true });

        // Если изменился поисковый запрос или тип, сбрасываем страницу на 1
        if (str !== this.state.searchStr || type !== this.state.searchType) {
            page = 1;
        }

        this.setState({ searchStr: str, searchType: type, currentPage: page });

        let url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(str.trim())}&api_key=b4cdbc073401accd6cbd9c94796ca890&format=json&limit=10&page=${page}`;

        if (type === 'artist') {
            url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(str.trim())}&api_key=b4cdbc073401accd6cbd9c94796ca890&format=json&limit=10&page=${page}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (type === 'artist' && data.results && data.results.artistmatches && data.results.artistmatches.artist) {
                    // Для артистов
                    const artists = data.results.artistmatches.artist;
                    const total = parseInt(data.results['opensearch:totalResults'], 10) || 0;
                    this.setState({ 
                        tracks: artists, 
                        loading: false, 
                        totalResults: total,
                        totalPages: Math.ceil(total / 10)
                    });
                } else if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
                    // Для треков
                    const tracks = data.results.trackmatches.track;
                    const total = parseInt(data.results['opensearch:totalResults'], 10) || 0;
                    this.setState({ 
                        tracks: tracks, 
                        loading: false, 
                        totalResults: total,
                        totalPages: Math.ceil(total / 10)
                    });
                } else {
                    this.setState({ tracks: [], loading: false, totalResults: 0, totalPages: 0 });
                }
            })
            .catch(error => {
                console.error('Error searching music:', error);
                this.setState({ loading: false });
            });
    };

    handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= this.state.totalPages) {
            this.searchMusic(this.state.searchStr, this.state.searchType, newPage);
        }
    };

    render() {
        const { loading, tracks, currentPage, totalPages } = this.state;

        return (
            <div className='main'>
                <div className='wrap'>
                    <Search searchMusic={this.searchMusic} />
                    {
                        !loading && tracks.length ? 
                            <MusicList tracks={tracks} /> : 
                            <Preloader />
                    }
                    {tracks.length > 0 && !loading && (
                        <div className="pagination">
                            <button 
                                onClick={() => this.handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button 
                                onClick={() => this.handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Main;
