import { IUser } from 'types';
import { Fetcher } from '../utils/Fetcher';

export const send_game_invite = async (id: string, resetUser?: any) => {
	try {
		const response = await Fetcher.post(
			'/game_invites/',
			{
				id,
			},
			resetUser
		);
		const data = await response.json();
		if (response.status === 200) data.status = 'success';
		return data;
	} catch (error) {
		return {
			error: 'Something went wrong, please try again later!',
		};
	}
};

export const delete_game_invite = async (id: string, resetUser?: any) => {
	try {
		const response = await Fetcher.delete(
			'/game_invites/',
			{
				id,
			},
			resetUser
		);
		const data = await response.json();

		if (response.status === 200) data.status = 'success';

		return data;
	} catch (error) {
		return {
			error: 'Something went wrong, please try again later!',
		};
	}
};

export const accept_game_invite = async (id: string, resetUser?: any) => {
	try {
		const response = await Fetcher.post(
			'/matches/',
			{
				id,
			},
			resetUser
		);
		const data = await response.json();

		if (response.status === 200) data.status = 'success';

		return data;
	} catch (error) {
		return {
			error: 'Something went wrong, please try again later!',
		};
	}
};



