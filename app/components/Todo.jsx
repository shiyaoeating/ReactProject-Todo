var React = require('react');
var moment = require('moment');
var {connect} = require('react-redux');
var actions = require('actions');

var Todo = React.createClass({
	onClickHandler: function() {
		var {id} = this.props;
		this.props.onToggle(id);
	},

	render: function() {
		var {id, text, completed, createdAt, completedAt, dispatch} = this.props;
		var todoClassName = completed? 'todo todo-completed' : 'todo';

		var renderDate = function() {
			var message = 'Created ';
			var timestamp = createdAt;

			if (completed) {
				message = 'Completed ';
				timestamp = completedAt;
			}

			return message + moment.unix(timestamp).format('MMM Do YYYY @  h:mm a');
		};

		return (
			<div  className={todoClassName} onClick={() => {
				dispatch(actions.startToggleTodo(id, !completed));
			}}> 
				<div>
					<input type="checkbox" checked={completed}/>
				</div>
				<div>
					<p>{text}</p>
					<p className="todo__subtext">{renderDate()}</p>
				</div>
			</div>
		);
	}
});

module.exports = connect()(Todo);