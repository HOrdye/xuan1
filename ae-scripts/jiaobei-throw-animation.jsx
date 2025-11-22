/**
 * After Effects 筊杯投掷动画脚本
 * 
 * 使用方法：
 * 1. 在 After Effects 中，选择 File > Scripts > Run Script File
 * 2. 选择此脚本文件
 * 3. 脚本会自动创建筊杯投掷动画所需的图层和关键帧
 * 
 * 导出为 Lottie：
 * 1. 安装 Bodymovin 插件
 * 2. Window > Extensions > Bodymovin
 * 3. 选择合成，点击 Render 导出 JSON
 */

(function() {
  // 检查是否在 After Effects 中运行
  if (typeof app === 'undefined' || app.project === null) {
    alert('此脚本需要在 After Effects 中运行');
    return;
  }
  
  app.beginUndoGroup('创建筊杯投掷动画');
  
  try {
    // 创建新合成
    var compWidth = 1920;
    var compHeight = 1080;
    var compDuration = 3; // 3秒
    var compFPS = 60;
    
    var comp = app.project.items.addComp('筊杯投掷动画', compWidth, compHeight, 1, compDuration, compFPS);
    
    // 创建背景图层
    var bgLayer = comp.layers.addShape();
    bgLayer.name = '背景';
    var bgShape = bgLayer.content.addProperty('ADBE Vector Group');
    var bgRect = bgShape.content.addProperty('ADBE Vector Shape - Rect');
    bgRect.size.setValue([compWidth, compHeight]);
    var bgFill = bgShape.content.addProperty('ADBE Vector Graphic - Fill');
    bgFill.color.setValue([0.04, 0.04, 0.10]); // 深紫色背景
    
    // 创建地面图层
    var groundLayer = comp.layers.addShape();
    groundLayer.name = '地面';
    var groundShape = groundLayer.content.addProperty('ADBE Vector Group');
    var groundRect = groundShape.content.addProperty('ADBE Vector Shape - Rect');
    groundRect.size.setValue([compWidth, compHeight * 0.3]);
    var groundFill = groundShape.content.addProperty('ADBE Vector Graphic - Fill');
    groundFill.color.setValue([0.1, 0.1, 0.15]);
    groundLayer.transform.position.setValue([compWidth / 2, compHeight * 0.85]);
    
    // 创建筊杯1（使用形状图层）
    var cup1Layer = comp.layers.addShape();
    cup1Layer.name = '筊杯1';
    
    // 筊杯形状（月牙形）
    var cup1Group = cup1Layer.content.addProperty('ADBE Vector Group');
    cup1Group.name = '筊杯形状';
    
    // 创建月牙路径
    var cup1Path = cup1Group.content.addProperty('ADBE Vector Shape - Group');
    cup1Path.name = '月牙路径';
    
    // 使用路径工具创建月牙形状
    var cup1Shape = cup1Path.content.addProperty('ADBE Vector Shape - Star');
    cup1Shape.type.setValue(2); // 自定义路径
    
    // 筊杯填充
    var cup1Fill = cup1Group.content.addProperty('ADBE Vector Graphic - Fill');
    cup1Fill.color.setValue([0.86, 0.15, 0.15]); // 红色
    cup1Fill.opacity.setValue(100);
    
    // 筊杯描边
    var cup1Stroke = cup1Group.content.addProperty('ADBE Vector Graphic - Stroke');
    cup1Stroke.color.setValue([0.6, 0.1, 0.1]);
    cup1Stroke.strokeWidth.setValue(2);
    
    // 设置初始位置（屏幕中央上方）
    cup1Layer.transform.position.setValue([compWidth / 2 - 50, compHeight / 2 - 100]);
    cup1Layer.transform.scale.setValue([100, 100, 100]);
    cup1Layer.transform.rotation.setValue([0, 0, 0]);
    
    // 创建筊杯2
    var cup2Layer = comp.layers.addShape();
    cup2Layer.name = '筊杯2';
    
    var cup2Group = cup2Layer.content.addProperty('ADBE Vector Group');
    cup2Group.name = '筊杯形状';
    
    var cup2Path = cup2Group.content.addProperty('ADBE Vector Shape - Group');
    cup2Path.name = '月牙路径';
    
    var cup2Shape = cup2Path.content.addProperty('ADBE Vector Shape - Star');
    cup2Shape.type.setValue(2);
    
    var cup2Fill = cup2Group.content.addProperty('ADBE Vector Graphic - Fill');
    cup2Fill.color.setValue([0.86, 0.15, 0.15]);
    cup2Fill.opacity.setValue(100);
    
    var cup2Stroke = cup2Group.content.addProperty('ADBE Vector Graphic - Stroke');
    cup2Stroke.color.setValue([0.6, 0.1, 0.1]);
    cup2Stroke.strokeWidth.setValue(2);
    
    cup2Layer.transform.position.setValue([compWidth / 2 + 50, compHeight / 2 - 100]);
    cup2Layer.transform.scale.setValue([100, 100, 100]);
    cup2Layer.transform.rotation.setValue([0, 0, 0]);
    
    // 创建阴影图层
    var shadowLayer = comp.layers.addShape();
    shadowLayer.name = '阴影';
    var shadowGroup = shadowLayer.content.addProperty('ADBE Vector Group');
    var shadowEllipse = shadowGroup.content.addProperty('ADBE Vector Shape - Ellipse');
    shadowEllipse.size.setValue([200, 30]);
    var shadowFill = shadowGroup.content.addProperty('ADBE Vector Graphic - Fill');
    shadowFill.color.setValue([0, 0, 0]);
    shadowFill.opacity.setValue(30);
    shadowLayer.transform.position.setValue([compWidth / 2, compHeight * 0.85]);
    
    // 添加3D属性
    cup1Layer.threeDLayer = true;
    cup2Layer.threeDLayer = true;
    
    // 创建投掷动画关键帧
    var timeStart = 0;
    var timeUp = 0.3;
    var timePeak = 0.6;
    var timeLand = 1.5;
    var timeEnd = 2.0;
    
    // 筊杯1动画
    var cup1Pos = cup1Layer.transform.position;
    var cup1Rot = cup1Layer.transform.rotation;
    var cup1Scale = cup1Layer.transform.scale;
    
    // 初始位置
    cup1Pos.setValueAtTime(timeStart, [compWidth / 2 - 50, compHeight / 2 - 100, 0]);
    cup1Rot.setValueAtTime(timeStart, [0, 0, 0]);
    cup1Scale.setValueAtTime(timeStart, [100, 100, 100]);
    
    // 向上投掷
    cup1Pos.setValueAtTime(timeUp, [compWidth / 2 - 50, compHeight / 2 - 250, -100]);
    cup1Scale.setValueAtTime(timeUp, [120, 120, 120]);
    
    // 最高点（旋转）
    cup1Pos.setValueAtTime(timePeak, [compWidth / 2 - 50, compHeight / 2 - 300, -150]);
    cup1Rot.setValueAtTime(timePeak, [360, 180, 720]);
    
    // 落地位置（左侧）
    cup1Pos.setValueAtTime(timeLand, [compWidth / 2 - 200, compHeight * 0.75, 0]);
    cup1Rot.setValueAtTime(timeLand, [0, 0, 0]);
    cup1Scale.setValueAtTime(timeLand, [100, 100, 100]);
    
    // 弹跳
    cup1Pos.setValueAtTime(timeLand + 0.1, [compWidth / 2 - 200, compHeight * 0.75 - 20, 0]);
    cup1Pos.setValueAtTime(timeLand + 0.2, [compWidth / 2 - 200, compHeight * 0.75, 0]);
    
    // 添加缓动
    cup1Pos.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)]);
    cup1Pos.setTemporalEaseAtKey(2, [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)]);
    cup1Pos.setTemporalEaseAtKey(3, [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)], [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)]);
    
    // 筊杯2动画（类似但方向相反）
    var cup2Pos = cup2Layer.transform.position;
    var cup2Rot = cup2Layer.transform.rotation;
    var cup2Scale = cup2Layer.transform.scale;
    
    cup2Pos.setValueAtTime(timeStart, [compWidth / 2 + 50, compHeight / 2 - 100, 0]);
    cup2Rot.setValueAtTime(timeStart, [0, 0, 0]);
    cup2Scale.setValueAtTime(timeStart, [100, 100, 100]);
    
    cup2Pos.setValueAtTime(timeUp, [compWidth / 2 + 50, compHeight / 2 - 250, -100]);
    cup2Scale.setValueAtTime(timeUp, [120, 120, 120]);
    
    cup2Pos.setValueAtTime(timePeak, [compWidth / 2 + 50, compHeight / 2 - 300, -150]);
    cup2Rot.setValueAtTime(timePeak, [360, 180, -720]);
    
    cup2Pos.setValueAtTime(timeLand, [compWidth / 2 + 200, compHeight * 0.75, 0]);
    cup2Rot.setValueAtTime(timeLand, [180, 0, 0]); // 反面朝上
    cup2Scale.setValueAtTime(timeLand, [100, 100, 100]);
    
    cup2Pos.setValueAtTime(timeLand + 0.1, [compWidth / 2 + 200, compHeight * 0.75 - 20, 0]);
    cup2Pos.setValueAtTime(timeLand + 0.2, [compWidth / 2 + 200, compHeight * 0.75, 0]);
    
    // 阴影动画
    var shadowScale = shadowLayer.transform.scale;
    var shadowOpacity = shadowLayer.transform.opacity;
    
    shadowScale.setValueAtTime(timeStart, [100, 100, 100]);
    shadowOpacity.setValueAtTime(timeStart, 30);
    
    shadowScale.setValueAtTime(timeLand, [150, 150, 100]);
    shadowOpacity.setValueAtTime(timeLand, 60);
    
    shadowScale.setValueAtTime(timeEnd, [120, 120, 100]);
    shadowOpacity.setValueAtTime(timeEnd, 40);
    
    // 添加相机（可选，用于3D视角）
    var camera = comp.layers.addCamera('相机', [compWidth / 2, compHeight / 2]);
    camera.transform.position.setValue([compWidth / 2, compHeight / 2, -2000]);
    camera.transform.pointOfInterest.setValue([compWidth / 2, compHeight / 2, 0]);
    
    // 添加灯光（增强3D效果）
    var light = comp.layers.addLight('主光源', [compWidth / 2, compHeight / 2 - 200]);
    light.lightOptions.intensity.setValue(100);
    light.lightOptions.color.setValue([1, 1, 1]);
    
    app.endUndoGroup();
    
    // 打开合成窗口
    comp.openInViewer();
    
    alert('筊杯投掷动画已创建！\n\n下一步：\n1. 调整关键帧和缓动曲线\n2. 添加材质和光照效果\n3. 使用 Bodymovin 导出为 Lottie JSON');
    
  } catch (error) {
    app.endUndoGroup();
    alert('错误：' + error.toString());
  }
})();










