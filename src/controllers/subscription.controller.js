import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription

  const { channelId } = req.params;
  const { userId } = req.user._id; // Assuming req.user contains authenticated user's info

  const subscription = await Subscription.findOne({
    $where: { channelId, userId },
  });

  if (subscription) {
    // If subscription exists, unsubscribe
    await subscription.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, "Unsubscribed successfully"));

  } else {
    // Otherwise, subscribe
    await Subscription.create({ userId, channelId });

    return res
      .status(201)
      .json(new ApiResponse(201, "Subscribed successfully"));

  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    const {userId} = req.user._id
    const subscriptions = await Subscription.findAll({
        where: { userId: subscriberId },
        include: [{ model: Channel, as: 'channel' }]
    });

    return res.status(200).json(new ApiResponse(200, 'Subscribed channels retrieved successfully', subscriptions));
 
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
