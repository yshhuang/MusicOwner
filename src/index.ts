import axios from 'axios';
import cheerio from 'cheerio';
import cryptojs from 'crypto-js';
import dayjs from 'dayjs';
import bigInt from 'big-integer';
import he from 'he';
import qs from 'qs';

// TODO: 你可以在这里写插件的逻辑

// 注意：不要使用async () => {}，hermes不支持异步箭头函数
const search: IPlugin.ISearchFunc = async function (query, page, type) {
  if (type === 'music') {
    return {
      isEnd: true,
      data: []
    }
  };
}

import { AuthType, FileStat, createClient } from "webdav";

interface ICachedData {
  url?: string;
  username?: string;
  password?: string;
  searchPath?: string;
  searchPathList?: string[];
  cacheFileList?: FileStat[];
}

let cachedData: ICachedData = {};

function getClient() {
  const { url, username, password, searchPath } =
    env?.getUserVariables?.() ?? {};
  if (!(url && username && password)) {
    return null;
  }

  if (
    !(
      cachedData.url === url &&
      cachedData.username === username &&
      cachedData.password === password &&
      cachedData.searchPath === searchPath
    )
  ) {
    cachedData.url = url;
    cachedData.username = username;
    cachedData.password = password;
    cachedData.searchPath = searchPath;
    cachedData.searchPathList = searchPath?.split?.(",");
    cachedData.cacheFileList = null;
  }

  return createClient(url, {
    authType: AuthType.Password,
    username,
    password,
  });
}

async function searchMusic(query: string) {
  const client = getClient();
  if (!cachedData.cacheFileList) {
    const searchPathList = cachedData.searchPathList?.length
      ? cachedData.searchPathList
      : ["/"];
    let result: FileStat[] = [];

    for (let search of searchPathList) {
      try {
        const fileItems = (
          (await client.getDirectoryContents(search)) as FileStat[]
        ).filter((it) => it.type === "file" && it.mime.startsWith("audio"));
        result = [...result, ...fileItems];
      } catch { }
    }
    cachedData.cacheFileList = result;
  }

  return {
    isEnd: true,
    data: (cachedData.cacheFileList ?? [])
      .filter((it) => it.basename.includes(query))
      .map((it) => ({
        title: it.basename,
        id: it.filename,
        artist: "未知作者",
        album: "未知专辑",
      })),
  };
}

const pluginInstance: IPlugin.IPluginDefine = {
  platform: "MusicOwner",
  version: "1.0.0",
  // TODO: 在这里把插件剩余的功能补充完整

  search: search,

};


// export default pluginInstance;

module.exports = {
  platform: "MusicOwner",
  version: "1.0.0",
  userVariables: [
    {
      key: "url",
      name: "WebDAV地址",
    },
    {
      key: "username",
      name: "用户名",
    },
    {
      key: "password",
      name: "密码",
      type: "password",
    },
    {
      key: "searchPath",
      name: "存放歌曲的路径",
    },
  ],
  search
}