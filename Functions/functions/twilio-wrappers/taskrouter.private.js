const { TaskRouterUtils } = require('@twilio/flex-plugins-library-utils');

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.workflowSid the workflow to submit the task
 * @param {string} parameters.taskChannel the task channel to submit the task on
 * @param {object} parameters.attributes the attributes applied to the task
 * @param {number} parameters.priority the priority
 * @param {number} parameters.timeout timeout
 * @returns {object} an object containing the task if successful
 * @description creates a task
 */
exports.createTask = async function createTask(parameters) {
  const { context, workflowSid, taskChannel, attributes, priority, timeout, attempts } = parameters;
  const region = context.TWILIO_REGION ? context.TWILIO_REGION.split('-')[0] : '';

  const client = context.getTwilioClient();
  const taskRouterClient = new TaskRouterUtils(client, {
    flexWorkSpaceSid: context.TASK_ROUTER_WORKSPACE_SID,
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    region
  });

  try {
    const task = await taskRouterClient.createTask({
      attempts: attempts || 3,
      attributes: JSON.stringify(attributes),
      priority,
      taskChannel,
      timeout,
      workflowSid
    });

    const result = {
      success: task.success,
      taskSid: task.taskSid,
      task: {
        ...task.task,
        attributes: JSON.parse(task.task.attributes),
      },
      status: task.status,
    };

    return result;
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};
