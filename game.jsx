const UPDATE_LENGTH = 'UPDATE_LENGTH';
const START_GAME = 'START_GAME';
const STOP_GAME = 'STOP_GAME';
const PRESSED_THE_BUTTON = 'PRESSED_THE_BUTTON';
const BEEPED = 'BEEPED';
const SOUND_500hz_2s = '/audiocheck.net_sin_500Hz_-3dBFS_2s.wav';
const SOUND_1000hz_01s = '/audiocheck.net_sin_1000Hz_-3dBFS_0.1s.wav';

var startGame = () => {return {type: START_GAME}};
var stopGame = () => {return {type: STOP_GAME}};
var beeped = () => {return {type: BEEPED}};
var pressedTheButton = () => {return {type: PRESSED_THE_BUTTON, date: new Date()}};

function updateLength(delay) {
    return {
        type: UPDATE_LENGTH,
        delay: delay
    }
}

const initialState = {
    delay: 1000,
    running: false,
    stars: [],
    maxStars: 5
};

function beepoApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState
    }
    var newStars;

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
                running: true,
                stars: []
            });
        case STOP_GAME:
            return Object.assign({}, state, {
                running: false
            });
        case PRESSED_THE_BUTTON:
            newStars = state.stars.map((s) => {return s});
            console.log(newStars);
            if (newStars.length) {
                newStars.pop();
                newStars.push(true);
            }
            return Object.assign({}, state, {
                stars: newStars
            });
        case BEEPED:
            console.log(state.stars);
            newStars = state.stars.map((s) => {return s});
            console.log(newStars);
            newStars.push(false);
            console.log(newStars);
            return Object.assign({}, state, {
                stars: newStars
            });
        default:
            return state;
    }
}



window.store = Redux.createStore(beepoApp);
var store = window.store;

console.log(store.getState());

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
                    <div className="row">
                        <div className="col-xs-1"><ConnectedSmile/></div>
                        <div className="col-xs-11">
                        </div>
                    </div>
                </div>
                <div className="col-xs-4">
                    <ControlForm/>
                </div>
            </div>
        );
    }
});

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
                           onClick={e => {store.dispatch(startGame());}}/>
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
