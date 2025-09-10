import React from 'react';
import './Search.css';

class Search extends React.Component {
    state = {
        search: '',
        type: 'all'  // 'all' — треки, 'artist' — артисты
    };

    handleKey = (event) => {
        if (event.key === 'Enter') {
            this.props.searchMusic(this.state.search, this.state.type);
        }
    };

    handlerFilter = (event) => {
        this.setState(
            () => ({ type: event.target.dataset.type }),
            () => {
                this.props.searchMusic(this.state.search, this.state.type);
            }
        );
    };

    render() {
        return (
            <>
                <div className='search'>
                    <input
                        type="search"
                        placeholder='Введите название трека или артиста'
                        value={this.state.search}
                        onChange={(e) => this.setState({ search: e.target.value })}
                        onKeyDown={this.handleKey}
                    />
                    <button
                        className='btn'
                        onClick={() => this.props.searchMusic(this.state.search, this.state.type)}
                    >
                        Поиск
                    </button>
                </div>
                <div className='radio'>
                    <div>
                        <input
                            type="radio"
                            name="type"
                            data-type="all"
                            checked={this.state.type === 'all'}
                            onChange={this.handlerFilter}
                        />
                        <span>Треки</span>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="type"
                            data-type="artist"
                            checked={this.state.type === 'artist'}
                            onChange={this.handlerFilter}
                        />
                        <span>Артисты</span>
                    </div>
                </div>
            </>
        );
    }
}

export default Search;
