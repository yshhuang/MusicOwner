var $8zHUo$webdav = require("webdav");


let $882b6d93070905b3$var$cachedData = {};
function $882b6d93070905b3$var$getClient() {
    const { url: url, username: username, password: password, searchPath: searchPath } = env?.getUserVariables?.() ?? {};
    if (!(url && username && password)) return null;
    if (!($882b6d93070905b3$var$cachedData.url === url && $882b6d93070905b3$var$cachedData.username === username && $882b6d93070905b3$var$cachedData.password === password && $882b6d93070905b3$var$cachedData.searchPath === searchPath)) {
        $882b6d93070905b3$var$cachedData.url = url;
        $882b6d93070905b3$var$cachedData.username = username;
        $882b6d93070905b3$var$cachedData.password = password;
        $882b6d93070905b3$var$cachedData.searchPath = searchPath;
        $882b6d93070905b3$var$cachedData.searchPathList = searchPath?.split?.(",");
        $882b6d93070905b3$var$cachedData.cacheFileList = null;
    }
    return (0, $8zHUo$webdav.createClient)(url, {
        authType: (0, $8zHUo$webdav.AuthType).Password,
        username: username,
        password: password
    });
}
async function $882b6d93070905b3$var$searchMusic(query) {
    const client = $882b6d93070905b3$var$getClient();
    if (!$882b6d93070905b3$var$cachedData.cacheFileList) {
        const searchPathList = $882b6d93070905b3$var$cachedData.searchPathList?.length ? $882b6d93070905b3$var$cachedData.searchPathList : [
            "/"
        ];
        let result = [];
        for (let search of searchPathList)try {
            const fileItems = (await client.getDirectoryContents(search)).filter((it)=>it.type === "file" && it.mime.startsWith("audio"));
            result = [
                ...result,
                ...fileItems
            ];
        } catch  {}
        $882b6d93070905b3$var$cachedData.cacheFileList = result;
    }
    return {
        isEnd: true,
        data: ($882b6d93070905b3$var$cachedData.cacheFileList ?? []).filter((it)=>it.basename.includes(query)).map((it)=>({
                title: it.basename,
                id: it.filename,
                artist: "未知作者",
                album: "未知专辑"
            }))
    };
}
async function $882b6d93070905b3$var$getTopLists() {
    $882b6d93070905b3$var$getClient();
    const data = {
        title: "全部歌曲",
        data: ($882b6d93070905b3$var$cachedData.searchPathList || []).map((it)=>({
                title: it,
                id: it
            }))
    };
    return [
        data
    ];
}
async function $882b6d93070905b3$var$getTopListDetail(topListItem) {
    const client = $882b6d93070905b3$var$getClient();
    const fileItems = (await client.getDirectoryContents(topListItem.id)).filter((it)=>it.type === "file" && it.mime.startsWith("audio"));
    return {
        musicList: fileItems.map((it)=>({
                title: it.basename,
                id: it.filename,
                artist: "未知作者",
                album: "未知专辑"
            }))
    };
}
module.exports = {
    platform: "MusicOwner",
    author: "yshhuang",
    description: "使用此插件前先配置用户变量",
    userVariables: [
        {
            key: "url",
            name: "WebDAV地址"
        },
        {
            key: "username",
            name: "用户名"
        },
        {
            key: "password",
            name: "密码",
            type: "password"
        },
        {
            key: "searchPath",
            name: "存放歌曲的路径"
        }
    ],
    version: "0.0.4",
    supportedSearchType: [
        "music"
    ],
    srcUrl: "https://gitee.com/yshhuang/MusicOwner/raw/main/dist/plugin.js",
    cacheControl: "no-cache",
    search (query, page, type) {
        if (type === "music") return $882b6d93070905b3$var$searchMusic(query);
    },
    getTopLists: $882b6d93070905b3$var$getTopLists,
    getTopListDetail: $882b6d93070905b3$var$getTopListDetail,
    getMediaSource (musicItem) {
        const client = $882b6d93070905b3$var$getClient();
        return {
            url: client.getFileDownloadLink(musicItem.id)
        };
    }
};


//# sourceMappingURL=plugin.js.map
