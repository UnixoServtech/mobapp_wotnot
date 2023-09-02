import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import {useDispatch,useSelector} from 'react-redux';
import {CONVERSATION} from '../../constants/global';
import {navigate} from '../../navigator/NavigationUtils';
import {
  fetchConversation,
  fetchConversationBySearch,
} from '../../store/actions';
import { handleFailureCallback } from '../../util/apiHelper';
import {getDayDifference, hp, wp} from '../../util/helper';
import colors from '../../util/theme/colors';
import ChatItem from '../ChatItem';
import Text from '../Text';

const renderItem = ({item}) => {
  return (
    <ChatItem
      key={item?.assignee?.id}
      name={item?.title ?? 'Unknown'}
      email={`${item?.assignee?.name} | ${item?.city_name},${item?.country_name}`}
      uri={item?.assignee?.image_url}
      isOnline={item?.visitor_status === CONVERSATION.USER_STATUS.ONLINE}
      unreadCount={item?.unread_messages_count}
      lastMessageDay={getDayDifference(item?.last_message_at)}
      subTittle={`${item?.message} `}
      onPress={() => {
        navigate('ConversationScreen', {itemData: item});
      }}
      item={item}
      isClosedMode={item?.status_id === 2}
    />
  );
};

const EmptyListView = () => {
  return (
    <View style={{}}>
      <Text>No conversations yet!</Text>
    </View>
  );
};

const ConversationList = ({
  tabData,
  totalCount = () => {},
  isSearchView = false,
  searchQuery = '',
}) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    isRefreshing: false,
    conversationData: [],
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => _getConversationsAPI(), [tabData, searchQuery]);
  const userPreference = useSelector(state => state.detail?.userPreference);
  const _getConversationsAPI = () => {
    setState(prev => ({
      ...prev,
      isRefreshing: true,
    }));
    const fetchAllConversations = statusId => {
      if (isSearchView) {
        dispatch(
          fetchConversationBySearch(
            userPreference?.logged_in_user_id,
            `status_ids=${statusId}&is_order_by_asc=false&limit=25&${
              searchQuery ? `search_words=${searchQuery}` : ''
            }`,
            {
              SuccessCallback: response => {
                console.log("response",JSON.stringify(response))
                setState(prev => ({
                  ...prev,
                  isRefreshing: false,
                  conversationData: response?.conversations,
                }));
              },
              FailureCallback: error => {
                console.log("FailureCallback",JSON.stringify(error))
                setState(prev => ({
                  ...prev,
                  isRefreshing: false,
                }));
              },
            },
          ),
        );
      } else {
        dispatch(
          fetchConversation(
            userPreference?.logged_in_user_id,
            statusId,
            CONVERSATION.LIMIT,
            {
              SuccessCallback: response => {
                let sortedData = response?.conversations ?? [];
                switch (tabData.conversationType) {
                  case 'you':
                    sortedData = sortedData.filter(
                      _it => _it.assignee?.id === 74692,
                    );
                    break;
                  case 'assigned':
                    sortedData = sortedData.filter(
                      _it => Object.entries(_it.assignee).length > 0,
                    );
                    break;
                  case 'unassigned':
                    sortedData = sortedData.filter(
                      _it => Object.entries(_it.assignee).length === 0,
                    );
                    break;
                  default:
                    totalCount(
                      tabData.conversationType,
                      response?.conversations,
                    );
                    break;
                }
                setState(prev => ({
                  ...prev,
                  isRefreshing: false,
                  conversationData: sortedData,
                }));
              },
              FailureCallback: error => {
                console.log('FailureCallback',JSON.stringify(error))
                handleFailureCallback(error)
                setState(prev => ({
                  ...prev,
                  isRefreshing: false,
                }));
              },
            },
          ),
        );
      }
    };

    if (isSearchView) {
      fetchAllConversations(['1', '2']);
    } else {
      fetchAllConversations(tabData?.statusId);
    }
  };
  return (
    <FlatList
      data={state?.conversationData}
      renderItem={renderItem}
      style={{paddingHorizontal: wp(4), paddingVertical: hp(2)}}
      refreshControl={
        <RefreshControl
          refreshing={state.isRefreshing}
          onRefresh={_getConversationsAPI}
          tintColor={colors.brandColor.blue}
        />
      }
      ListEmptyComponent={<EmptyListView />}
    />
  );
};

export default ConversationList;
