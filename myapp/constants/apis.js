module.exports = {
	// Simple user apis.
	get_all_users_url: 'http://localhost:3000/users?page={page}&pageSize={pageSize}',
	get_a_specific_user_url: 'http://localhost:3000/users/{userId}',
	create_a_new_user_url: 'http://localhost:3000/users/',
	update_a_user_url: 'http://localhost:3000/users/{userId}',
	delete_a_user_url: 'http://localhost:3000/users/{userId}',

	// Followings apis.
	get_all_followings_url: 'http://localhost:3000/users/{userId}/followings?page={page}&pageSize={pageSize}',
	check_if_user_is_following_other_user_url: 'http://localhost:3000/users/{userId}/followings/{otherUserId}',
	make_user_following_other_user_url: 'http://localhost:3000/users/{userId}/followings/{otherUserId}',
	make_user_unfollow_other_user_url: 'http://localhost:3000/users/{userId}/followings/{otherUserId}',

	// Followers apis.
	get_all_followers_url: 'http://localhost:3000/users/{userId}/followers?page={page}&pageSize={pageSize}',
	check_if_user_is_a_follower_of_other_user_url: 'http://localhost:3000/users/{userId}/followers/{otherUserId}',
	make_other_user_a_follwer_of_user_url: 'http://localhost:3000/users/{userId}/followers/{otherUserId}',
	make_other_user_unfollow_user_url: 'http://localhost:3000/users/{userId}/followers/{otherUserId}',

	// Friends apis.
	get_all_friends_url: 'http://localhost:3000/users/{userId}/friends?radius={radius}&page={page}&pageSize={pageSize}',
	check_if_user_is_a_friend_of_other_user_url: 'http://localhost:3000/users/{userId}/friends/{otherUserId}'

}