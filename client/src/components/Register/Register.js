/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { shape, string } from 'prop-types';
import Container from '../Container';

import { authSelectors, authOperations } from '../../state/redux/auth';
import { tableSelectors } from '../../state/redux/tables';

const { channelsSelector } = tableSelectors;

const styles = theme => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
			.spacing.unit * 3}px`
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit
	},
	title: {
		marginTop: theme.spacing.unit * 2
	},
	actions: {
		marginTop: theme.spacing.unit * 3
	},
	errortext: {
		fontSize: 16,
		font: 'bold',
		color: 'red'
	},
	successtext: {
		fontSize: 16,
		font: 'bold',
		color: 'green'
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing.unit,
		top: theme.spacing.unit,
		color: theme.palette.grey[500]
	}
});

export class Register extends Component {
	static propTypes = {
		classes: shape({
			form: string,
			container: string,
			paper: string,
			actions: string
		}).isRequired
	};

	constructor(props) {
		super(props);
		const { registered } = props;
		this.state = {
			info: null,
			user: {
				error: null,
				value: ''
			},
			firstname: {
				error: null,
				value: ''
			},
			lastname: {
				error: null,
				value: ''
			},
			email: {
				error: null,
				value: ''
			},
			password: {
				error: null,
				value: ''
			},
			password2: {
				error: null,
				value: ''
			},
			roles: {
				error: null,
				value: ''
			},
			viewchannel: {
				error: null,
				value: ''
			},
			rolesList: ['admin', 'user'],
			error: '',
			registered,
			isLoading: false,
			allValid: false,
			lastSaved: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		const { registered = [], error } = nextProps;
		this.setState(() => ({
			registered,
			error
		}));
	}

	handleChange = event => {
		const { target } = event;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const { name } = target;
		this.setState({
			[name]: { value }
		});

		let password2 = {};
		if (name === 'password') {
			if (
				this.state.password2.value.length &&
				value !== this.state.password2.value
			) {
				password2 = {
					value: this.state.password2.value,
					error: 'The password confirmation does not match.'
				};
			} else {
				password2 = { value: this.state.password2.value, error: null };
			}
		} else if (name === 'password2') {
			if (
				this.state.password.value.length &&
				value !== this.state.password.value
			) {
				password2 = { value, error: 'The password confirmation does not match.' };
			} else {
				password2 = { value, error: null };
			}
		} else {
			password2 = this.state.password2;
		}

		this.setState({ password2 }, () => {
			if (
				this.state.user.value &&
				this.state.password.value &&
				this.state.password2.value &&
				this.state.roles.value &&
				!this.state.password2.error
			) {
				this.setState({ allValid: true });
			} else if (this.state.allValid) {
				this.setState({ allValid: false });
			}
		});
	};

	submitForm = async e => {
		e.preventDefault();

		const { register, userlist } = this.props;
		const {
			user,
			password,
			password2,
			roles,
			firstname,
			lastname,
			email,
			viewchannel
		} = this.state;

		const userInfo = {
			user: user.value,
			password: password.value,
			password2: password2.value,
			roles: roles.value,
			firstname: firstname.value,
			lastname: lastname.value,
			email: email.value,
			viewchannel: viewchannel.value
		};

		const info = await register(userInfo);
		await userlist();
		this.setState(() => ({ info }));
		this.setState(() => ({ lastSaved: user.value }));
		this.resetForm();
		return true;
	};
	resetForm() {
		const user = {
			error: null,
			value: ''
		};
		const firstname = {
			error: null,
			value: ''
		};
		const lastname = {
			error: null,
			value: ''
		};
		const email = {
			error: null,
			value: ''
		};
		const password = {
			error: null,
			value: ''
		};
		const password2 = {
			error: null,
			value: ''
		};
		const roles = {
			error: null,
			value: ''
		};
		const viewchannel = {
			error: null,
			value: ''
		};
		this.setState({
			user: user,
			firstname: firstname,
			lastname: lastname,
			email: email,
			password: password,
			password2: password2,
			roles: roles,
			viewchannel: viewchannel
		});
	}

	render() {
		const {
			info,
			user,
			password,
			password2,
			roles,
			viewchannel,
			firstname,
			lastname,
			email,
			rolesList,
			isLoading,
			lastSaved
		} = this.state;
		const { channels: channelArr, classes, error, onClose } = this.props;
		const listChannels = [];
		channelArr.forEach(channel => {
			listChannels.push({
				channelName: channel.channelname,
				channelGenesisHash: channel.channel_genesis_hash
			});
		});
		console.log(listChannels);

		return (
			<Container>
				<Paper className={classes.paper}>
					<Typography className={classes.title} component="h5" variant="headline">
						Register User
					</Typography>
					<MuiDialogTitle>
						{onClose ? (
							<IconButton
								aria-label="Close"
								className={classes.closeButton}
								onClick={onClose}
							>
								<CloseIcon />
							</IconButton>
						) : null}
					</MuiDialogTitle>
					<form className={classes.form} onSubmit={this.submitForm}>
						<FormControl margin="normal" required fullWidth>
							<TextField
								required
								fullWidth
								id="user"
								name="user"
								label="User"
								disabled={isLoading}
								value={user.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
							/>
							{user.error && (
								<FormHelperText id="component-error-text" error>
									{user.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<TextField
								fullWidth
								id="firstname"
								name="firstname"
								label="First name"
								disabled={isLoading}
								value={firstname.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
							/>
							{firstname.error && (
								<FormHelperText id="component-error-text" error>
									{firstname.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<TextField
								fullWidth
								id="lastname"
								name="lastname"
								label="Last name"
								disabled={isLoading}
								value={lastname.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
							/>
							{lastname.error && (
								<FormHelperText id="component-error-text" error>
									{lastname.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<TextField
								fullWidth
								id="email"
								name="email"
								label="E-mail address"
								disabled={isLoading}
								value={email.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
							/>
							{email.error && (
								<FormHelperText id="component-error-text" error>
									{email.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<TextField
								required
								fullWidth
								error={!!password.error}
								id="password"
								type="password"
								name="password"
								label="Password"
								disabled={isLoading}
								value={password.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
							/>
							{password.error && (
								<FormHelperText id="component-error-text" error>
									{password.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<TextField
								error={!!password2.error}
								required
								fullWidth
								id="password2"
								type="password"
								name="password2"
								label="Password(confirm)"
								disabled={isLoading}
								value={password2.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
							/>
							{password2.error && (
								<FormHelperText id="component-error-text" error>
									{password2.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<TextField
								required
								fullWidth
								select
								error={!!roles.error}
								id="roles"
								type="roles"
								name="roles"
								label="Roles"
								disabled={isLoading}
								value={roles.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
							>
								{rolesList.map(item => (
									<MenuItem key={item} value={item}>
										{item}
									</MenuItem>
								))}
							</TextField>
							{roles.error && (
								<FormHelperText id="component-error-text" error>
									{roles.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<TextField
								required
								fullWidth
								select
								error={!!roles.error}
								id="viewchannel"
								type="viewchannel"
								name="viewchannel"
								label="Select Channel"
								disabled={isLoading}
								value={viewchannel.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
							>
								{listChannels.map(item => (
									<MenuItem key={item.channelName} value={item.channelGenesisHash}>
										{item.channelName}
									</MenuItem>
								))}
							</TextField>
							{viewchannel.error && (
								<FormHelperText id="component-error-text" error>
									{viewchannel.error}
								</FormHelperText>
							)}
						</FormControl>
						{error && (
							<FormHelperText id="component-error-text" error>
								{error}
							</FormHelperText>
						)}
						{info && lastSaved && (
							<FormHelperText
								id="component-error-text"
								className={
									info.status === 'success' ? classes.successtext : classes.errortext
								}
							>
								{`User '${lastSaved}' ${info.message}`}
							</FormHelperText>
						)}
						<Grid
							container
							spacing={16}
							direction="row"
							justify="flex-end"
							className={classes.actions}
						>
							<Grid item>
								<Button fullWidth variant="contained" color="primary" onClick={onClose}>
									Cancel
								</Button>
							</Grid>
							<Grid item>
								<Button
									disabled={!this.state.allValid}
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
								>
									Register
								</Button>
							</Grid>
						</Grid>
					</form>
				</Paper>
			</Container>
		);
	}
}

const { errorSelector, registeredSelector } = authSelectors;

export default compose(
	withStyles(styles),
	connect(
		state => ({
			registered: registeredSelector(state),
			error: errorSelector(state),
			channels: channelsSelector(state)
		}),
		{
			register: authOperations.register,
			userlist: authOperations.userlist
		}
	)
)(Register);
