import firebase, {firebaseRef, githubProvider} from 'app/firebase/';
import moment from 'moment';

export var setSearchText = function(searchText) {
	return {
		type: 'SET_SEARCH_TEXT',
		searchText
	};
};

// toggleShowCompleted TOGGLE_SHOW_COMPLETED
export var toggleShowCompleted = function() {
	return {
		type: 'TOGGLE_SHOW_COMPLETED',

	};
};

export var addTodo = function(todo) {
	return {
		type: 'ADD_TODO',
		todo
	};
};

export var startAddTodo = function(text) {
	return function(dispatch, getState) {
		var todo = {
			text: text,
			completed: false,
			createdAt: moment().unix(),
			completedAt: null
		};

		var todoRef = firebaseRef.child('todos').push(todo);

		return todoRef.then(function() {
			dispatch(addTodo({
				...todo,
				id: todoRef.key
			}));
		});
	};	
};

// toggleTodo(id) TOGGLE_TODO
export var updateTodo = function(id, updates) {
	return {
		type: 'UPDATE_TODO',
		id,
		updates
	};
};

export var startToggleTodo = function(id, completed) {
	return function(dispatch, getState) {
		var todoRef = firebaseRef.child('todos/' + id);
		var updates = {
			completed: completed,
			completedAt: completed? moment().unix() : null
		};

		todoRef.update(updates).then( () => {
			dispatch(updateTodo(id, updates));
		});
	};
};

export var addTodos = function(todos) {
	return {
		type: 'ADD_TODOS',
		todos: todos
	};
};

export var startAddTodos = function() {
	return function(dispatch, getState) {
		var todosRef = firebaseRef.child('todos');

		return todosRef.once('value').then((snapshot) => {
			var todos = snapshot.val() || {};
			var parsedTodos = [];

			Object.keys(todos).forEach((todoId) => {
				parsedTodos.push({
					id: todoId,
					...todos[todoId]
				});
			});

			dispatch(addTodos(parsedTodos));
		});
	};
};

export var startLogin = function() {
	return (dispatch, getState) => {
		firebase.auth().signInWithPopup(githubProvider).then((result) => {
			console.log('Auth worked', result);
		}, (e) => {
			console.log('Unable to auth', e);
		});
	};
};

export var startLogout= function() {
	return (dispatch, getState) => {
		return firebase.auth().signOut().then(() => {
			console.log('Logged out!');
		});
	};
};