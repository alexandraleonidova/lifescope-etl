'use strict';

const _ = require('lodash');

const perPage = 2;


function call(connection, parameters, headers, results) {
	let dataLength, lastItem, self = this;

	let outgoingHeaders = headers || {};
	let outgoingParameters = parameters || {};

	outgoingHeaders['X-Connection-Id'] = connection.remote_connection_id.toString('hex');
	outgoingParameters.count = outgoingParameters.count || perPage;

	if (this.population != null) {
		outgoingHeaders['X-Populate'] = this.population;
	}

	if (_.get(connection, 'endpoint_data.direct_messages_sent.since_id') != null) {
		outgoingParameters.since_id = connection.endpoint_data.direct_messages_sent.since_id;
	}

	return this.api.endpoint(this.mapping)({
		headers: outgoingHeaders,
		parameters: outgoingParameters
	})
		.then(function([data, response]) {
			if (results == null) {
				results = [];
			}

			results = results.concat(data);

			dataLength = data.length;
			lastItem = data[data.length - 1];

			if (!(/^2/.test(response.statusCode))) {
				let body = JSON.parse(response.body);

				return Promise.reject(new Error('Error calling ' + self.name + ': ' + body.message));
			}

			return Promise.resolve();
		})
		.then(function() {
			if (dataLength === perPage) {
				return self.paginate(connection, {
					maxId: lastItem.id_str
				}, {}, results);
			}
			else {
				if (results.length > 0) {
					return db.db('live').collection('connections').updateOne({
						_id: connection._id
					}, {
						$set: {
							'endpoint_data.direct_messages_sent.since_id': results[0].id_str
						}
					});
				}
				return Promise.resolve(results);
			}
		})
		.catch(function(err) {
			console.log('Error calling Twitter Direct Messages Sent:');
			console.log(err);

			return Promise.reject(err);
		});
}


module.exports = call;