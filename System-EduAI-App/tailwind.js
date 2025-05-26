const tailwind = require("tailwind-rn");
const { StyleSheet } = require("react-native");

const styles = {
  container: tailwind("flex-1 bg-teal-50"),
  header: tailwind("w-full h-64 bg-teal-500"),
  content: tailwind("w-full h-full bg-white rounded-t-3xl mt-[-20]"),
  profileImage: tailwind("w-32 h-32 rounded-full shadow-lg"),
  infoCard: tailwind("w-full h-44 bg-white rounded-lg shadow-md p-4"),
  row: tailwind("flex-row items-center mb-2"),
  label: tailwind("text-lg font-bold text-teal-500 mr-2"),
  value: tailwind("text-base"),
  updateLink: tailwind("text-right text-blue-300 font-bold text-sm"),
  logoutRow: tailwind("flex-row items-center justify-end mb-2"),
  logoutIcon: tailwind("text-teal-500"),
  logoutText: tailwind("text-base font-bold"),
  postsSection: tailwind("mb-2"),
  postsTitle: tailwind("text-lg font-bold"),
  seeAll: tailwind("text-blue-400 text-sm font-bold"),
  tabList: tailwind("flex-row"),
  tabButton: tailwind("bg-gray-200 rounded px-2 py-1 mr-2"),
  tabButtonActive: tailwind("bg-teal-500 text-white"),
  postCard: tailwind("w-76 mr-4"),
  postImage: tailwind("w-full h-24 rounded-t-lg"),
  postContent: tailwind("p-2"),
  postTitle: tailwind("text-2xl font-bold"),
  postTag: tailwind("bg-teal-400 rounded-full px-2 py-1 mt-1"),
  postTagText: tailwind("text-white text-sm font-bold"),
  postDetail: tailwind("text-blue-500 text-xs font-medium"),
};

module.exports = StyleSheet.create(styles);