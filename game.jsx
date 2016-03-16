const UPDATE_LENGTH = 'UPDATE_LENGTH';
const START_GAME = 'START_GAME';
const STOP_GAME = 'STOP_GAME';
const PRESSED_THE_BUTTON = 'PRESSED_THE_BUTTON';
const BEEPED = 'BEEPED';
const CLEAR = 'CLEAR';
const SOUND_500hz_2s = '/audiocheck.net_sin_500Hz_-3dBFS_2s.wav';
const SOUND_1000hz_01s = '/audiocheck.net_sin_1000Hz_-3dBFS_0.1s.wav';

var startGame = () => ({type: START_GAME});
var stopGame = () => ({type: STOP_GAME});
var clear = () => ({type: CLEAR});
var beeped = () => ({type: BEEPED});
var pressedTheButton = () => ({type: PRESSED_THE_BUTTON});

function updateLength(delay) {
    return {
        type: UPDATE_LENGTH,
        delay: delay
    }
}

const initialState = {
    delay: 500,
    running: false,
    stars: [],
    maxStars: 27
};

function beepoApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState
    }
    var newStars;
    console.log(action);

    switch (action.type) {
        case UPDATE_LENGTH:
            if (action.delay > 0) {
                return Object.assign({}, state, {
                    delay: parseFloat(action.delay)
                });
            }
            return state;
        case START_GAME:
            return Object.assign({}, state, {
                running: true
            });
        case CLEAR:
            return Object.assign({}, state, {
                stars: []
            });
        case STOP_GAME:
            return Object.assign({}, state, {
                running: false
            });
        case PRESSED_THE_BUTTON:
            newStars = state.stars.map((s) => (s));
            if (newStars.length) {
                newStars.pop();
                newStars.push(true);
            }
            return Object.assign({}, state, {
                stars: newStars
            });
        case BEEPED:
            newStars = state.stars.map((s) => (s));
            newStars.push(false);
            return Object.assign({}, state, {
                stars: newStars
            });
        default:
            return state;
    }
}


window.store = Redux.createStore(beepoApp);
var store = window.store;

store.subscribe(() =>
    console.log("New state:", store.getState())
);

var musicIntervalId = null;
var audio_1000hz_01s = new Audio(SOUND_1000hz_01s);

var beep = () => {
    var state = store.getState();
    if (state.running) {
        if (state.stars.length < state.maxStars) {
            setTimeout(() => {
                audio_1000hz_01s.play()
            }, 13);
            store.dispatch(beeped());
        } else {
            store.dispatch(stopGame());
        }
    }
    setTimeout(beep, state.delay > 100 ? state.delay : 100);
};
beep();

document.addEventListener("keydown", (event) => {
    if (event.keyCode == 32 || event.keyCode == 13) {
        store.dispatch(pressedTheButton());
    }
});

var GameBox = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-xs-8">
                    <ConnectedStarsBunch/>
                </div>
                <div className="col-xs-4">
                    <ControlForm/>
                </div>
            </div>
        );
    }
});

const Star = ({good}) => {
    if (good) {
        return (<div className="star star-good"></div>);
    } else {
        return (<div className="star star-bad"></div>);
    }
};

const StarsBunch = ({stars, maxStars}) => {
    var newStars = stars.map((s) => (s));
    while (newStars.length < maxStars) {
        newStars.push(false);
    }
    return (<div>{newStars.map(good => <Star good={good}/>)}</div>);
};

const ConnectedStarsBunch = ReactRedux.connect((state) => {
    return {stars: state.stars, maxStars: state.maxStars}
})(StarsBunch);


const Smile = ({show}) => {
    if (show) {
        return (<div>:-)</div>);
    } else if (show === false) {
        return (<div>:-(</div>);
    } else {
        return (<div>x-|</div>);
    }
};

const ConnectedSmile = ReactRedux.connect((state) => {return {show: state.stars.length ? state.stars[state.stars.length - 1] : undefined }})(Smile);

var ControlForm = React.createClass({
    render: function () {
        return (
            <form>
                <div className="form-group">
                    <label for="delay">Delay between 'beeps'</label>
                    <input onChange={e => {store.dispatch(updateLength(e.target.value));}}
                           type="number"
                           className="form-control"
                           id="delay"
                           placeholder="Milliseconds"
                           inputmode="numeric"
                           step="100"
                           value={this.props.delay}
                           min="100"/>
                </div>
                <div className="btn-group" role="group">
                    <input type="button"
                           className="btn btn-primary"
                           value="Start"
                           onClick={e => {store.dispatch(clear()); store.dispatch(startGame());}}/>
                    <input type="button"
                           className="btn btn-default"
                           value="Stop"
                           onClick={e => {store.dispatch(stopGame());}}/>
                </div>
            </form>
        );
    }
});

ControlForm = ReactRedux.connect((state) => {return {delay: state.delay}})(ControlForm);

ReactDOM.render(
    <ReactRedux.Provider store={store}><GameBox/></ReactRedux.Provider>,
    document.getElementById('game'));
