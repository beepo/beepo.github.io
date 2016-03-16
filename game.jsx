const UPDATE_LENGTH = 'UPDATE_LENGTH';
const START_GAME = 'START_GAME';
const STOP_GAME = 'STOP_GAME';
const SOUND_500hz_2s = '/audiocheck.net_sin_500Hz_-3dBFS_2s.wav';
const SOUND_1000hz_01s = '/audiocheck.net_sin_1000Hz_-3dBFS_0.1s.wav';

var startGame = () => {return {type: START_GAME}};
var stopGame = () => {return {type: STOP_GAME}};

function updateLength(delay) {
    return {
        type: UPDATE_LENGTH,
        delay: delay
    }
}

const initialState = {
    delay: 1000,
    running: false
};

function beepoApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState
    }

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
        case STOP_GAME:
            return Object.assign({}, state, {
                running: false
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
        setTimeout(() => {
            audio_1000hz_01s.play()
        }, 13);
    }
    setTimeout(beep, state.delay > 100 ? state.delay : 100);
};

beep();

var GameBox = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-xs-8"></div>
                <div className="col-xs-4">
                    <ControlForm/>
                </div>
            </div>
        );
    }
});

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
