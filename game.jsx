const UPDATE_LENGTH = 'UPDATE_LENGTH';

function updateLength(music, beep) {
    return {
        type: UPDATE_LENGTH,
        music: music,
        beep: beep
    }
}

window.updateLength = updateLength;

const initialState = {
    length: {
        music: 1,
        beep: 0.1
    }
};

function beepoApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState
    }

    switch (action.type) {
        case UPDATE_LENGTH:
            return Object.assign({}, state, {
                length: {
                    music: action.music > 0 ? parseFloat(action.music) : 1,
                    beep: action.beep > 0 ? parseFloat(action.beep) : 0.1
                }
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

var GameBox = React.createClass({
    getInitialState: function () {
        return {
            musicLength: store.getState().length.music,
            beepLength: store.getState().length.beep
        };
    },
    render: function () {
        return (
            <div className="row">
                <div className="col-xs-8">Stuff</div>
                <div className="col-xs-4">
                    <ControlForm/>
                </div>
            </div>
        );
    }
});

var ControlForm = React.createClass({
    render: function () {
        let musicInput, beepInput;
        console.log("Rendering:", this);
        console.log("with props:", this.props);

        return (
            <form onSubmit={e => {
                console.log("submit:", e);
                e.preventDefault();
                store.dispatch(updateLength(musicInput.value, beepInput.value));
            }}>
                <div className="form-group">
                    <label for="musicLength">Delay between 'beeps'</label>
                    <input ref={node => {musicInput=node; node.value = store.getState().length.music}} type="number" className="form-control" id="musicLength" placeholder="Seconds" inputmode="numeric" step="1" min="0"/>
                </div>
                <div className="form-group">
                    <label for="beepLength">Length of 'beep' sound</label>
                    <input ref={node => {beepInput=node; node.value = store.getState().length.beep}} type="number" className="form-control" id="beepLength" placeholder="Seconds" inputmode="numeric" step="0.1" min="0"/>
                </div>
                <input type="submit" className="btn btn-default" value="Start"/>
            </form>
        );
    }
});

ReactDOM.render(
    <ReactRedux.Provider store={store}><GameBox/></ReactRedux.Provider>,
    document.getElementById('game'));
