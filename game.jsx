var GameBox = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-xs-8">Stuff</div>
                <div className="col-xs-4">Control</div>
            </div>
        );
    }
});

ReactDOM.render(<GameBox/>, document.getElementById('game'));
