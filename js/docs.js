var updateDoc4_5_linux = {
	title:"Linux系统中RTC 4.x.x 如何升级到 5.x.x",
	description:"这个文档讲介绍在Linux系统中RTC如何从4.x.x版本升级到5.x.x版本，请按照步骤操作",
	link:"docs/rtc_update_4_5_linux.pdf"
}
var updateDoc4_5_windows = {
	title:"Windows系统中RTC 4.x.x 如何升级到 5.x.x",
	description:"这个文档讲介绍在Windows系统中RTC如何从4.x.x版本升级到5.x.x版本，请按照步骤操作",
	link:"docs/rtc_update_4_5_windows.pdf"
}
var updateDoc5_6_linux = {
	title:"Linux系统中RTC 5.x.x 如何升级到 6.x.x",
	description:"这个文档讲介绍在Linux系统中RTC如何从5.x.x版本升级到6.x.x版本，请按照步骤操作",
	link:"docs/rtc_update_5_6_linux.pdf"
}
var updateDoc5_6_windows = {
	title:"Windows系统中RTC 5.x.x 如何升级到 6.x.x",
	description:"这个文档讲介绍在Windows系统中RTC如何从5.x.x版本升级到6.x.x版本，请按照步骤操作",
	link:"docs/rtc_update_5_6_windows.pdf"
}

var extentionsDoc_1 = {
	title:"RTC如何进行扩展开发",
	description:"这个文档讲介绍在RTC中如何进行RTC的扩展开发，请按照步骤操作",
	link:"docs/rtc_extension_01.pdf"
}

var rtcUpdate4_5_linux = {
	keywords:"Linux RTC 4.x.x 到 5.x.x",
	total:1,
	list:[
		updateDoc4_5_linux
	]
};

var rtcUpdate4_5_windows = {
	keywords:"Windows RTC 4.x.x 到 5.x.x",
	total:1,
	list:[
		updateDoc4_5_windows
	]
};

var rtcUpdate5_6_linux = {
	keywords:"Linux RTC 5.x.x 到 6.x.x",
	total:1,
	list:[
		updateDoc5_6_linux
	]
}

var rtcUpdate5_6_windows = {
	keywords:"Windows RTC 5.x.x 到 6.x.x",
	total:1,
	list:[
		updateDoc5_6_windows
	]
}

var rtcUpdate4_6_linux = {
	keywords:"Linux RTC 4.x.x 到 6.x.x",
	needTips: true,
	tipsInfo: "RTC不支持从4.x.x直接升级到6.x.x，您需要讲您的RTC版本先升级到5.x.x，然后再进行升级到6.x.x",
	total:1,
	list:[
		updateDoc4_5_linux,
		updateDoc5_6_linux
	]
}

var rtcUpdate4_6_windows = {
	keywords:"Windows RTC 4.x.x 到 6.x.x",
	needTips: true,
	tipsInfo: "RTC不支持从4.x.x直接升级到6.x.x，您需要讲您的RTC版本先升级到5.x.x，然后再进行升级到6.x.x",
	total:1,
	list:[
		updateDoc4_5_windows,
		updateDoc5_6_windows
	]
}

var rtcExtensionInfo = {
	keywords:"RTC 扩展开发",
	total:1,
	list:[
		extentionsDoc_1
	]
}

