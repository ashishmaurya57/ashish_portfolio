/**
 * Explicit icon registry.
 *
 * Sections used to do a namespace import (`import * as SiIcons from
 * "react-icons/si"`) and index into it by string. That defeats tree-shaking
 * completely: the
 * whole Simple Icons and Tabler sets shipped, ~5.2 MB raw / 1.98 MB gzip of
 * icons the page never renders.
 *
 * Named imports let the bundler drop everything not listed here. If you add
 * an icon to constants.js, add it below too — getIcon falls back to TbCode
 * rather than throwing, so a missed entry degrades quietly instead of
 * crashing the page.
 */
import {
  SiApachekafka, SiCodechef, SiCodeforces, SiCplusplus, SiCss3, SiDocker, SiExpress, SiFastapi,
  SiGeeksforgeeks, SiGithubactions, SiGooglecloud, SiGrafana, SiHtml5, SiJavascript,
  SiJsonwebtokens, SiKubernetes, SiLeetcode, SiMlflow, SiMongodb, SiMysql, SiNodedotjs, SiNumpy,
  SiPandas, SiPostgresql, SiPrisma, SiPrometheus, SiPython, SiPytorch, SiReact, SiRedis,
  SiScikitlearn, SiStripe, SiTailwindcss, SiTensorflow, SiTerraform, SiTypescript,
} from "react-icons/si";
import {
  TbAbc, TbAdjustmentsBolt, TbApi, TbBinaryTree, TbBoxMultiple, TbBrain, TbBroadcast, TbBulb,
  TbChartHistogram, TbCloudCog, TbCode, TbCursorText, TbDatabase, TbDatabaseSearch, TbHammer,
  TbKey, TbLayersIntersect, TbLink, TbMathFunction, TbMicrophone, TbPlugConnected, TbRobot,
  TbSearch, TbServerBolt, TbShieldBolt, TbShieldCheck, TbShieldLock, TbSitemap, TbSortAscending,
  TbTable, TbTargetArrow, TbTool, TbTopologyStar3, TbTransform, TbVectorTriangle, TbVolume,
} from "react-icons/tb";

const ICONS = {
  SiApachekafka, SiCodechef, SiCodeforces, SiCplusplus, SiCss3, SiDocker, SiExpress, SiFastapi,
  SiGeeksforgeeks, SiGithubactions, SiGooglecloud, SiGrafana, SiHtml5, SiJavascript,
  SiJsonwebtokens, SiKubernetes, SiLeetcode, SiMlflow, SiMongodb, SiMysql, SiNodedotjs, SiNumpy,
  SiPandas, SiPostgresql, SiPrisma, SiPrometheus, SiPython, SiPytorch, SiReact, SiRedis,
  SiScikitlearn, SiStripe, SiTailwindcss, SiTensorflow, SiTerraform, SiTypescript,
  TbAbc, TbAdjustmentsBolt, TbApi, TbBinaryTree, TbBoxMultiple, TbBrain, TbBroadcast, TbBulb,
  TbChartHistogram, TbCloudCog, TbCode, TbCursorText, TbDatabase, TbDatabaseSearch, TbHammer,
  TbKey, TbLayersIntersect, TbLink, TbMathFunction, TbMicrophone, TbPlugConnected, TbRobot,
  TbSearch, TbServerBolt, TbShieldBolt, TbShieldCheck, TbShieldLock, TbSitemap, TbSortAscending,
  TbTable, TbTargetArrow, TbTool, TbTopologyStar3, TbTransform, TbVectorTriangle, TbVolume,
};

/** Look up an icon component by the string name stored in constants.js. */
export const getIcon = (name) => ICONS[name] || TbCode;

export default ICONS;
