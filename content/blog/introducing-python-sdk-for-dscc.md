---
title: Introducing Python SDK for DSCC
date: 2023-03-29T13:45:50.979Z
priority: 0
author: Anusha Y and Sijeesh Kattumunda
authorimage: /img/Avatar1.svg
disable: false
---
<!--\[if !mso]>
<style>
v\:* {behavior:url(#default#VML);}
o\:* {behavior:url(#default#VML);}
w\:* {behavior:url(#default#VML);}
.shape {behavior:url(#default#VML);}
</style>
<!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:OfficeDocumentSettings>
  <o:AllowPNG/>
 </o:OfficeDocumentSettings>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <w:WordDocument>
  <w:View>Normal</w:View>
  <w:Zoom>0</w:Zoom>
  <w:TrackMoves>false</w:TrackMoves>
  <w:TrackFormatting/>
  <w:PunctuationKerning/>
  <w:ValidateAgainstSchemas/>
  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
  <w:DoNotPromoteQF/>
  <w:LidThemeOther>EN-GB</w:LidThemeOther>
  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
  <w:LidThemeComplexScript>TA</w:LidThemeComplexScript>
  <w:Compatibility>
   <w:BreakWrappedTables/>
   <w:SnapToGridInCell/>
   <w:WrapTextWithPunct/>
   <w:UseAsianBreakRules/>
   <w:DontGrowAutofit/>
   <w:SplitPgBreakAndParaMark/>
   <w:EnableOpenTypeKerning/>
   <w:DontFlipMirrorIndents/>
   <w:OverrideTableStyleHps/>
  </w:Compatibility>
  <m:mathPr>
   <m:mathFont m:val="Cambria Math"/>
   <m:brkBin m:val="before"/>
   <m:brkBinSub m:val="&#45;-"/>
   <m:smallFrac m:val="off"/>
   <m:dispDef/>
   <m:lMargin m:val="0"/>
   <m:rMargin m:val="0"/>
   <m:defJc m:val="centerGroup"/>
   <m:wrapIndent m:val="1440"/>
   <m:intLim m:val="subSup"/>
   <m:naryLim m:val="undOvr"/>
  </m:mathPr></w:WordDocument>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"
  DefSemiHidden="false" DefQFormat="false" DefPriority="99"
  LatentStyleCount="376">
  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>
  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 9"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 1"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 2"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 3"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 4"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 5"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 6"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 7"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 8"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 9"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="header"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footer"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index heading"/>
  <w:LsdException Locked="false" Priority="35" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="caption"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of figures"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope address"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope return"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="line number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="page number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of authorities"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="macro"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="toa heading"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 5"/>
  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Closing"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Signature"/>
  <w:LsdException Locked="false" Priority="1" SemiHidden="true"
   UnhideWhenUsed="true" Name="Default Paragraph Font"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Message Header"/>
  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Salutation"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Date"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Note Heading"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Block Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Hyperlink"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="FollowedHyperlink"/>
  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>
  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Document Map"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Plain Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="E-mail Signature"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Top of Form"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Bottom of Form"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal (Web)"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Acronym"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Address"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Cite"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Code"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Definition"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Keyboard"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Preformatted"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Sample"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Typewriter"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Variable"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Table"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation subject"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="No List"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Contemporary"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Elegant"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Professional"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Balloon Text"/>
  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Theme"/>
  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>
  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>
  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>
  <w:LsdException Locked="false" Priority="34" QFormat="true"
   Name="List Paragraph"/>
  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>
  <w:LsdException Locked="false" Priority="30" QFormat="true"
   Name="Intense Quote"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>
  <w:LsdException Locked="false" Priority="19" QFormat="true"
   Name="Subtle Emphasis"/>
  <w:LsdException Locked="false" Priority="21" QFormat="true"
   Name="Intense Emphasis"/>
  <w:LsdException Locked="false" Priority="31" QFormat="true"
   Name="Subtle Reference"/>
  <w:LsdException Locked="false" Priority="32" QFormat="true"
   Name="Intense Reference"/>
  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>
  <w:LsdException Locked="false" Priority="37" SemiHidden="true"
   UnhideWhenUsed="true" Name="Bibliography"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>
  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>
  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>
  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>
  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>
  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>
  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>
  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>
  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>
  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 1"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 2"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 3"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 4"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 5"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 6"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>
  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>
  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 1"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 2"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 3"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 4"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 5"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 6"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Mention"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Smart Hyperlink"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Hashtag"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Unresolved Mention"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Smart Link"/>
 </w:LatentStyles>
</xml><!\[endif]-->

<!--\[if gte mso 10]>
<style>
 /* Style Definitions */
 table.MsoNormalTable
	{mso-style-name:"Table Normal";
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-parent:"";
	mso-padding-alt:0in 5.4pt 0in 5.4pt;
	mso-para-margin-top:0in;
	mso-para-margin-right:0in;
	mso-para-margin-bottom:8.0pt;
	mso-para-margin-left:0in;
	line-height:107%;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:Latha;
	mso-bidi-theme-font:minor-bidi;
	mso-fareast-language:EN-US;}
</style>
<!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:shapedefaults v:ext="edit" spidmax="1029"/>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:shapelayout v:ext="edit">
  <o:idmap v:ext="edit" data="1"/>
 </o:shapelayout></xml><!\[endif]-->

<!--StartFragment-->

In my previous [blog](https://developer.hpe.com/blog/get-started-building-dscc-api-client-libraries-for-python-using-openapi-generator/), I discussed how to generate a Software Development Kit (SDK) from the Data services cloud console (DSCC) Open API spec using a third-party tool called OpenAPI generator. Today, I am going to talk more in detail on the Python SDK generated using the tool. As we progress, we will discuss the implementation aspects, and then take up a use-case to better understand how to use the SDK.

Before we get into SDK, let’s understand the difference between an Application Programming Interface (API) and an SDK.

APIs are a list of functions libraries that are used to communicate with a web service (via secure HTTP), whereas an SDK is a development kit that facilitates the usage of these APIs. APIs enable any software developer to create business opportunities by leveraging the capabilities provided by the API to extend their application whereas the SDK facilitates the process for developers. An SDK is a collection of software tools and programs for a specific application platform that allows developers to manipulate the functions supported by the service. These can be considered as a wrapper on the top of the APIs, making the code consumable by the application.

One thing to note is that, the user always gets access to the latest DSCC API version through the SDKs. How? The SDK is designed and deployed (using CI/CD pipelines such as Jenkins) in such a way that with every new release of the DSCC Open API spec, the SDKs get updated automatically. Thus, keeping it up-to date without any manual intervention. This also reduces time which is spent waiting for updates with newer features.

# Let us take a look at the Python SDK

Due to the wide adoption of Python, and for the python lovers out there who did not have an option to achieve their automation goals, we have the Python SDK available now. You can access the SDK on this github page.

This SDK contains the following:

<!--\[if !supportLists]-->·        <!--\[endif]-->Documentation (under docs folder)

<!--\[if !supportLists]-->·        <!--\[endif]-->Code libraries (under greenlake_data_services folder)

<!--\[if !supportLists]-->·        <!--\[endif]-->Test file (under test folder)

<!--\[if !supportLists]-->·        <!--\[endif]-->README file

<!--\[if !supportLists]-->·        <!--\[endif]-->The Python libraries that are required to run this SDK (requirements.txt & test-requirements.txt)

**Requirements:**

All that is required for these scripts to run is Python (>=3.5). These scripts need the Python packages listed in the requirements.txt file. Then, all you have to do is execute the following command to install them:

pip install –r requirements.txt

**Example Usage:**

Let us consider Audits as an example. Audit events are a collection of tasks performed by users. The below code snippet uses a GET method to fetch the details of audit events, like task ID, user email, state, etc.

The sample code is provided in the [documentation](https://github.com/HewlettPackard/greenlake-data-services-python/blob/dev/docs/AuditEventApi.md#device_type2_get_events) of this resource. Take the sample code and replace the BEARER_TOKEN with the access token. Generate the access token as mentioned in this [blog](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/).

<!--\[if gte vml 1]><o:wrapblock><v:rect id="Rectangle_x0020_3"
  o:spid="_x0000_s1028" style='position:absolute;margin-left:-2.5pt;
  margin-top:0;width:474.65pt;height:915.95pt;z-index:251659264;visibility:visible;
  mso-wrap-style:square;mso-height-percent:0;mso-wrap-distance-left:9pt;
  mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
  mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
  mso-position-horizontal-relative:text;mso-position-vertical:absolute;
  mso-position-vertical-relative:text;mso-height-percent:0;
  mso-height-relative:margin;v-text-anchor:middle' o:gfxdata="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
J6pwiq8OU30vPzCFGpYdsGa9hX36v/EvAAAA//8DAFBLAwQUAAYACAAAACEAnGZGQbsAAAAkAQAA
KgAAAGNsaXBib2FyZC9kcmF3aW5ncy9fcmVscy9kcmF3aW5nMS54bWwucmVsc4SPzQrCMBCE74Lv
EPZu0noQkSa9iNCr1AcIyTYtNj8kUezbG+hFQfCyMLPsN7NN+7IzeWJMk3ccaloBQae8npzhcOsv
uyOQlKXTcvYOOSyYoBXbTXPFWeZylMYpJFIoLnEYcw4nxpIa0cpEfUBXNoOPVuYio2FBqrs0yPZV
dWDxkwHii0k6zSF2ugbSL6Ek/2f7YZgUnr16WHT5RwTLpRcWoIwGMwdKV2edNS1dgYmGff0m3gAA
AP//AwBQSwECLQAUAAYACAAAACEAu+VIlAUBAAAeAgAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRl
bnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAAIQCtMD/xwQAAADIBAAALAAAAAAAAAAAAAAAAADYB
AABfcmVscy8ucmVsc1BLAQItABQABgAIAAAAIQC0wjMH7RIAAPISAgAfAAAAAAAAAAAAAAAAACAC
AABjbGlwYm9hcmQvZHJhd2luZ3MvZHJhd2luZzEueG1sUEsBAi0AFAAGAAgAAAAhAJJ9h+AdBwAA
SSAAABoAAAAAAAAAAAAAAAAAShUAAGNsaXBib2FyZC90aGVtZS90aGVtZTEueG1sUEsBAi0AFAAG
AAgAAAAhAJxmRkG7AAAAJAEAACoAAAAAAAAAAAAAAAAAnxwAAGNsaXBib2FyZC9kcmF3aW5ncy9f
cmVscy9kcmF3aW5nMS54bWwucmVsc1BLBQYAAAAABQAFAGcBAACiHQAAAAA=
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
  <v:textbox>
   <!\[if !mso]>
   <table cellpadding=0 cellspacing=0 width="100%">
    <tr>
     <td><!\[endif]>
     <div>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p>&nbsp;</o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>import</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>time</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>import</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>pprint</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#DCDCAA'>pprint</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>api</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>audit_api</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>model</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>audit_bad_request</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>AuditBadRequest</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>model</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>audit_internal_server_error</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>AuditInternalServerError</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>model</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>audit_results</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>AuditResults</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>model</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>audit_service_unavailable</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>AuditServiceUnavailable</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>model</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>audit_user_forbidden</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>AuditUserForbidden</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>requests_oauthlib</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>OAuth2Session</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>requests</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>auth</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>HTTPBasicAuth</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>from</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>oauthlib</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>oauth2</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>import</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>BackendApplicationClient</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:12.0pt;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p>&nbsp;</o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#4FC1FF'>CLIENT_SECRET</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> = </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#CE9178'>&quot;36f6d0fa92ea11ecae650a4cf4dda9cf&quot;</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#4FC1FF'>CLIENT_ID</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> = </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#CE9178'>&quot;33a7fd43-4d63-41d5-8a10-1494eb5430c9&quot;</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#9CDCFE'>client</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> = </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>BackendApplicationClient</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4FC1FF'>CLIENT_ID</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>)<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#9CDCFE'>oauth</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> = </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>OAuth2Session</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>client</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>=</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>client</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>)<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#9CDCFE'>auth</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> = </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>HTTPBasicAuth</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4FC1FF'>CLIENT_ID</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>, </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4FC1FF'>CLIENT_SECRET</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>)<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#9CDCFE'>token</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> = </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>oauth</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#DCDCAA'>fetch_token</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>token_url</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>=</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#CE9178'>'https://sso.common.cloud.hpe.com/as/token.oauth2'</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>, </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>auth</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>=</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>auth</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>)<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#9CDCFE'>access_token</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> = </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>token</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>\[</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#CE9178'>&quot;access_token&quot;</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>]<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#6A9955'># The client must configure the
     authentication and authorization parameters</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#6A9955'># in accordance with the API server
     security policy.</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#6A9955'># Examples for each auth method are
     provided below, use the example that</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#6A9955'># satisfies your auth use case.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p>&nbsp;</o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#6A9955'># Configure Bearer authorization (JWT):
     JWTAuth</span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#9CDCFE'>configuration</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> = </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>Configuration</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>access_token</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#9CDCFE'>access_token</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>,<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>host</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#CE9178'>&quot;https://us1.data.cloud.hpe.com&quot;</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>)<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:12.0pt;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p>&nbsp;</o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#6A9955'># Enter a context with an instance of the
     API client</span><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#C586C0'>with</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>ApiClient</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>configuration</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>) </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>as</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>api_client</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>:<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#6A9955'># Create an instance
     of the API class</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>api_instance</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#4EC9B0'>audit_api</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>.</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>AuditApi</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>api_client</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>)<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>filter</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#CE9178'>&quot;filter_example&quot;</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#6A9955'>#
     str | Filter criteria - e.g. state eq Failure and occurredAt gt 2020-09-08T16:51:33Z
     (optional)</span><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>limit</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#B5CEA8'>1</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'> </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#6A9955'># int | The number
     of results to return (optional)</span><span lang=EN-US style='font-size:
     10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>offset</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#B5CEA8'>1</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'> </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#6A9955'># int | The number
     of results to skip (optional)</span><span lang=EN-US style='font-size:
     10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>sort</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#CE9178'>&quot;sort_example&quot;</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#6A9955'>#
     str | A comma separated list of properties to sort by, followed by a
     direction &nbsp;indicator (\&quot;asc\&quot; or \&quot;desc\&quot;). If no
     direction indicator is specified the &nbsp;default order is ascending. -
     e.g. state,version desc. Currently only support sorting by 1 property per
     request (optional)</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>select</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#CE9178'>&quot;select_example&quot;</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#6A9955'>#
     str | A list of properties to include in the response. Currently only
     support returning of all fields. (optional)</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p>&nbsp;</o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#C586C0'>try</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>:<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; &nbsp; &nbsp; </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#6A9955'>#
     GET audit-events</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; &nbsp; &nbsp; </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>api_response</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> =
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#9CDCFE'>api_instance</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>.</span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#DCDCAA'>audit_events_get</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>limit</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>=</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>limit</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>, </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>offset</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>=</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>offset</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>)</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#6A9955'>#filter=filter,
     , sort=sort, select=select)</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; &nbsp; &nbsp; </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#DCDCAA'>pprint</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>api_response</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>)<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#C586C0'>except</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>greenlake_data_services</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>.</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#4EC9B0'>ApiException</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#C586C0'>as</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#9CDCFE'>e</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>:<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>&nbsp; &nbsp; &nbsp; &nbsp; </span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#DCDCAA'>print</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'>(</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#CE9178'>&quot;Exception
     when calling AuditApi-&gt;audit_events_get: </span><span lang=EN-US
     style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:"Times New Roman";
     mso-bidi-font-family:"Times New Roman";color:#569CD6'>%s</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D7BA7D'>\n</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#CE9178'>&quot;</span><span
     lang=EN-US style='font-size:10.5pt;font-family:Consolas;mso-fareast-font-family:
     "Times New Roman";mso-bidi-font-family:"Times New Roman";color:#D4D4D4'> %
     </span><span lang=EN-US style='font-size:10.5pt;font-family:Consolas;
     mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";
     color:#9CDCFE'>e</span><span lang=EN-US style='font-size:10.5pt;
     font-family:Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'>)<o:p></o:p></span></p>
     <p class=MsoNormal style='margin-bottom:0in;line-height:14.25pt;
     background:#1E1E1E'><span lang=EN-US style='font-size:10.5pt;font-family:
     Consolas;mso-fareast-font-family:"Times New Roman";mso-bidi-font-family:
     "Times New Roman";color:#D4D4D4'><o:p>&nbsp;</o:p></span></p>
     <p class=MsoNormal align=center style='text-align:center'><span
     lang=EN-US><o:p>&nbsp;</o:p></span></p>
     </div>
     <!\[if !mso]></td>
    </tr>
   </table>
   <!\[endif]></v:textbox>
  <w:wrap type="topAndBottom"/>
 </v:rect><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|     | ![Text Box: import time
import greenlake_data_services
from pprint import pprint
from greenlake_data_services.api import audit_api
from greenlake_data_services.model.audit_bad_request import AuditBadRequest
from greenlake_data_services.model.audit_internal_server_error import AuditInternalServerError
from greenlake_data_services.model.audit_results import AuditResults
from greenlake_data_services.model.audit_service_unavailable import AuditServiceUnavailable
from greenlake_data_services.model.audit_user_forbidden import AuditUserForbidden
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth
from oauthlib.oauth2 import BackendApplicationClient

CLIENT_SECRET = "36f6d0fa92ea11ecae650a4cf4dda9cf"
CLIENT_ID = "33a7fd43-4d63-41d5-8a10-1494eb5430c9"
client = BackendApplicationClient(CLIENT_ID)
oauth = OAuth2Session(client=client)
auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=auth)
access_token = token\["access_token"\]
\# The client must configure the authentication and authorization parameters
\# in accordance with the API server security policy.
\# Examples for each auth method are provided below, use the example that
\# satisfies your auth use case.

\# Configure Bearer authorization (JWT): JWTAuth
configuration = greenlake_data_services.Configuration(
    access_token = access_token,
    host = "https://us1.data.cloud.hpe.com"
)

\# Enter a context with an instance of the API client
with greenlake_data_services.ApiClient(configuration) as api_client:
    \# Create an instance of the API class
    api_instance = audit_api.AuditApi(api_client)
    filter = "filter_example" # str \| Filter criteria - e.g. state eq Failure and occurredAt gt 2020-09-08T16:51:33Z (optional)
    limit = 1 # int \| The number of results to return (optional)
    offset = 1 # int \| The number of results to skip (optional)
    sort = "sort_example" # str \| A comma separated list of properties to sort by, followed by a direction  indicator (\\"asc\\" or \\"desc\\"). If no direction indicator is specified the  default order is ascending. - e.g. state,version desc. Currently only support sorting by 1 property per request (optional)
    select = "select_example" # str \| A list of properties to include in the response. Currently only support returning of all fields. (optional)

    try:
        \# GET audit-events
        api_response = api_instance.audit_events_get(limit=limit, offset=offset)#filter=filter, , sort=sort, select=select)
        pprint(api_response)
    except greenlake_data_services.ApiException as e:
        print("Exception when calling AuditApi->audit_events_get: %s\\n" % e)


](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image001.png) |

<!--\[endif]-->

<!--\[if gte vml 1]></o:wrapblock><!\[endif]-->

\
Save the file as GetAudits.py.

 

<!--\[if gte vml 1]><v:rect id="Rectangle_x0020_4" o:spid="_x0000_s1027"
 style='position:absolute;margin-left:0;margin-top:16.65pt;width:325.35pt;
 height:24pt;z-index:251660288;visibility:visible;mso-wrap-style:square;
 mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;
 mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;
 mso-position-horizontal:absolute;mso-position-horizontal-relative:text;
 mso-position-vertical:absolute;mso-position-vertical-relative:text;
 mso-height-percent:0;mso-height-relative:margin;v-text-anchor:middle'
 o:gfxdata="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
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span lang=EN-US>$python GetAudits.py<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:rect><!\[endif]--><!--\[if !vml]-->![Text Box: $python GetAudits.py](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image002.png)<!--\[endif]-->Run this Python script.

 

<!--\[if gte vml 1]><o:wrapblock><v:rect id="Rectangle_x0020_5"
  o:spid="_x0000_s1026" style='position:absolute;margin-left:0;margin-top:115.3pt;
  width:477.35pt;height:530.65pt;z-index:251661312;visibility:visible;
  mso-wrap-style:square;mso-height-percent:0;mso-wrap-distance-left:9pt;
  mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
  mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
  mso-position-horizontal-relative:text;mso-position-vertical:absolute;
  mso-position-vertical-relative:text;mso-height-percent:0;
  mso-height-relative:margin;v-text-anchor:middle' o:gfxdata="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
bWwucmVsc1BLBQYAAAAABQAFAGcBAABUEQAAAAA=
" fillcolor="black \[3213]" strokecolor="black \[3213]" strokeweight="1pt">
  <v:textbox>
   <!\[if !mso]>
   <table cellpadding=0 cellspacing=0 width="100%">
    <tr>
     <td><!\[endif]>
     <div>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'>$python .\GetAudits.py<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'>{'items': \[{'associated_resource': {'id':
     '/api/v1/tasks/3b0139a1-478b-4a24-9811-9a1e072b5744',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span
     style='mso-spacerun:yes'>                                   
     </span>'name': 'Delete [Vol-01.1]',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span
     style='mso-spacerun:yes'>                                   
     </span>'type': 'tasks'},<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'code': '',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'context_id': '18337cba-c12f-4c16-a1c2-755471de8ed1',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'customer_id': 'eb00678a466b11ec94d66ec0ab988305',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'id': '9794158b-fd2e-4cb6-bbf6-c9df3867d035',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'loggedAt': datetime.datetime(2022, 6, 8, 10, 12, 31,
     tzinfo=tzutc()),<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'message': 'Parent Task : Delete \[Vol-01.1] - Completed',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'occurred_at': '2022-06-08T10:12:31Z',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'permission': '',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'scope': '',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'source':
     '/api/v1/storage-systems/device-type1/2M29510B8L/volumes/0c24e55f12e5609ca0e2de527dfa8426',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'source_ip_address': 'fleet-gql-data-graph:4000',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>   </span><span
     style='mso-spacerun:yes'>         </span>'state': 'Success',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'task_id': '',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'unique_id': 'audit.events+2+24511',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'user_email': 'anusha.y@hpe.com',<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'>           
     </span>'version': 1}],<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span
     style='mso-spacerun:yes'> </span>'page_limit': 1,<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span
     style='mso-spacerun:yes'> </span>'page_offset': 1,<o:p></o:p></span></p>
     <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
     107%;font-family:Consolas'><span style='mso-spacerun:yes'> </span>'total':
     6978}<o:p></o:p></span></p>
     </div>
     <!\[if !mso]></td>
    </tr>
   </table>
   <!\[endif]></v:textbox>
  <w:wrap type="topAndBottom"/>
 </v:rect><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|     | ![Text Box: $python .\\GetAudits.py
{'items': \[{'associated_resource': {'id': '/api/v1/tasks/3b0139a1-478b-4a24-9811-9a1e072b5744',
                                    'name': 'Delete \[Vol-01.1\]',
                                    'type': 'tasks'},
            'code': '',
            'context_id': '18337cba-c12f-4c16-a1c2-755471de8ed1',
            'customer_id': 'eb00678a466b11ec94d66ec0ab988305',
            'id': '9794158b-fd2e-4cb6-bbf6-c9df3867d035',
            'loggedAt': datetime.datetime(2022, 6, 8, 10, 12, 31, tzinfo=tzutc()),
            'message': 'Parent Task : Delete \[Vol-01.1\] - Completed',
            'occurred_at': '2022-06-08T10:12:31Z',
            'permission': '',
            'scope': '',
            'source': '/api/v1/storage-systems/device-type1/2M29510B8L/volumes/0c24e55f12e5609ca0e2de527dfa8426',
            'source_ip_address': 'fleet-gql-data-graph:4000',
            'state': 'Success',
            'task_id': '',
            'unique_id': 'audit.events+2+24511',
            'user_email': 'anusha.y@hpe.com',
            'version': 1}\],
 'page_limit': 1,
 'page_offset': 1,
 'total': 6978}
](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image003.png) |

<!--\[endif]-->

<!--\[if gte vml 1]></o:wrapblock><!\[endif]-->

\
The output of the execution looks like this.

 

The output of these scripts will be in JSON format. These kinds of example scripts along with documentation are available in this SDK for all the resources mentioned in the DSCC API spec.

These sample scripts can be used as per the requirement/use case to build automation scripts.

 

**Next Steps**

Now that you have access to the Python SDK for DSCC, use it to create automations for any use-case that requires the use of DSCC APIs, right from your console. In my next blog, I talk about how to use Ansible playbooks to achive your automation goals for DSCC. Stay tuned!

 

<!--EndFragment-->