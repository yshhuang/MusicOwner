var $8zHUo$webdav = require("webdav");


// TODO: 你可以在这里写插件的逻辑
// 注意：不要使用async () => {}，hermes不支持异步箭头函数
const $882b6d93070905b3$var$search = async function(query, page, type) {
    if (type === "music") return {
        isEnd: true,
        data: []
    };
};
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
const $882b6d93070905b3$var$pluginInstance = {
    platform: "MusicOwner",
    version: "1.0.0",
    // TODO: 在这里把插件剩余的功能补充完整
    search: $882b6d93070905b3$var$search
};
// export default pluginInstance;
module.exports = {
    platform: "MusicOwner",
    version: "1.0.0",
    srcUrl: "https://gitee.com/yshhuang/MusicOwner/raw/master/dist/plugin.js",
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
    search: $882b6d93070905b3$var$search
};


//# sourceMappingURL=plugin.js.map
