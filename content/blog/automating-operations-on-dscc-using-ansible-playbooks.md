---
title: Automating operations on DSCC using Ansible Playbooks
date: 2023-03-29T14:00:40.866Z
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
table.MsoTableGrid
	{mso-style-name:"Table Grid";
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-priority:39;
	mso-style-unhide:no;
	border:solid windowtext 1.0pt;
	mso-border-alt:solid windowtext .5pt;
	mso-padding-alt:0in 5.4pt 0in 5.4pt;
	mso-border-insideh:.5pt solid windowtext;
	mso-border-insidev:.5pt solid windowtext;
	mso-para-margin:0in;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:Latha;
	mso-bidi-theme-font:minor-bidi;
	mso-ansi-language:EN-US;
	mso-fareast-language:EN-US;
	mso-bidi-language:AR-SA;}
</style>
<!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:shapedefaults v:ext="edit" spidmax="1033"/>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:shapelayout v:ext="edit">
  <o:idmap v:ext="edit" data="1"/>
 </o:shapelayout></xml><!\[endif]-->

<!--StartFragment-->

Automation is one of the top trends in technology and the pace of automation is accelerating with more companies opting for developing fully automated systems. Automation reduces time, effort, cost, and manual errors while increasing efficiency and productivity. Gone are those days when many complex coding skills were required to implement automation. Now, there are many low-code tools available in the market, like Ansible, that make automation easier.   

In this blog post, I am excited to be able to introduce the Ansible playbooks for DSCC and show you how to use them. Along with the Python SDK for DSCC, these playbooks should help you in your efforts to automate HPE GreenLake Data Services through an infrastructure-as-code approach.

Ansible is an open-source IT automation tool that automates provisioning, configuration management, application deployment, and many other IT processes.

Two main features that make Ansible the best choice for automation are:

<!--\[if !supportLists]-->·        <!--\[endif]-->Ansible does not require any programming.

<!--\[if !supportLists]-->·        <!--\[endif]-->Idempotence is offered as a built-in feature of many of the Ansible modules. This means the result of performing a task once is the same as performing it multiple times without any intervening actions.

**Why do we need Ansible playbooks for DSCC?**

Ansible helps the users/admins to automate the deployment of resources and applications without the manual overhead of creating everything from scratch. These playbooks can be configured with conditions, variables, and tasks. Currently, simple playbooks, like performing CRUD operations on the resources, are available. These playbooks can be considered basic building blocks and can be reused to build simple-to-complex use cases.

**Ansible Modules for DSCC:**

The following Ansible modules are currently available for DSCC. You can make use of the samples given or your own Ansible playbooks. Let's look at the Ansible modules available for the DSCC here. These modules are currently available in a GitHub repo.

|     |     |
| --- | --- |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |

 

**Prerequisites to use these Ansible playbooks:**

<!--\[if !supportLists]-->1.      <!--\[endif]-->Any machine with Python 3.8 or newer installed. This includes Red Hat, Debian, CentOS, macOS, any of the BSDs, and so on. (Microsoft Windows is not supported*)

<!--\[if !supportLists]-->2.      <!--\[endif]-->The latest and most stable version of Ansible must be installed. (current version is 2.9)

<!--\[if !supportLists]-->3.      <!--\[endif]-->HPE GreenLake Data Services Python SDK. (Installation procedure is mentioned below)

<!--\[if !supportLists]-->4.      <!--\[endif]-->Cloning the GitHub repo that has these playbooks

<!--\[if !supportLists]-->5.      <!--\[endif]-->Setup ANSIBLE_LIBRARY and ANSIBLE_MODULE_UTILS environment variables

(* If you are using Windows 10, then an Ubuntu terminal called [Windows Subsystem for Linux(WSL)](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#1-overview) can be used.)

 

**Installing Ansible on Ubuntu**

<!--\[if !supportLists]-->1.      <!--\[endif]--><!--\[if gte vml 1]><v:rect id="Rectangle_x0020_1"
 o:spid="_x0000_s1032" style='position:absolute;left:0;text-align:left;
 margin-left:2pt;margin-top:16.95pt;width:446.65pt;height:32pt;text-indent:0;
 z-index:251659264;visibility:visible;mso-wrap-style:square;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;v-text-anchor:middle' o:gfxdata="UEsDBBQABgAIAAAAIQC75UiUBQEAAB4CAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbKSRvU7DMBSF
dyTewfKKEqcMCKEmHfgZgaE8wMW+SSwc27JvS/v23KTJgkoXFsu+P+c7Ol5vDoMTe0zZBl/LVVlJ
gV4HY31Xy4/tS3EvRSbwBlzwWMsjZrlprq/W22PELHjb51r2RPFBqax7HCCXIaLnThvSAMTP1KkI
+gs6VLdVdad08ISeCho1ZLN+whZ2jsTzgcsnJwldluLxNDiyagkxOquB2Knae/OLUsyEkjenmdzb
mG/YhlRnCWPnb8C898bRJGtQvEOiVxjYhtLOxs8AySiT4JuDystlVV4WPeM6tK3VaILeDZxIOSsu
ti/jidNGNZ3/J08yC1dNv9v8AAAA//8DAFBLAwQUAAYACAAAACEArTA/8cEAAAAyAQAACwAAAF9y
ZWxzLy5yZWxzhI/NCsIwEITvgu8Q9m7TehCRpr2I4FX0AdZk2wbbJGTj39ubi6AgeJtl2G9m6vYx
jeJGka13CqqiBEFOe2Ndr+B03C3WIDihMzh6RwqexNA281l9oBFTfuLBBhaZ4ljBkFLYSMl6oAm5
8IFcdjofJ0z5jL0MqC/Yk1yW5UrGTwY0X0yxNwri3lQgjs+Qk/+zfddZTVuvrxO59CNCmoj3vCwj
MfaUFOjRhrPHaN4Wv0VV5OYgm1p+LW1eAAAA//8DAFBLAwQUAAYACAAAACEA8crcO4EDAADaCAAA
HwAAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWzUVsFu2zgUvC+w/0AQe20tO3bSGFUK
x7sJFjDaIG7R8wtFWcJSpJakHbtf3yEpOYrb5tDuZS82qTcczhu+R+ntu32j2E5aVxud8/HrjDOp
hSlqvcn5p483r95w5jzpgpTRMucH6fi7q99/e0vzjaW2qgUDg3ZzynnlfTsfjZyoZEPutWmlRqw0
tiGPqd2MCkuPYG7UaJJl56OGas2vnqj+JE9sa+ufoFJG/COLJekdOVAqMR8+6TQq8evMNNe7W9uu
2zsblIv3uzvL6iLncE5TA4v4qAt0MExHJ6s2TwT70jYBb8qS7XN+eXb5JgPVIefTs+xiks0Sndx7
JhCfnV9MprMZZyIgsvMpwGm/6sPLDKL662UOiExiMBgIdG2Qp3ffZjzuM76XAiWyUZKNj8kHeJ95
v9R1pv03OR/10ry1zt9K07AwyLmFnlhXtFs5n1T0kHgYvRC/X8fs/P7aFIeQ5wP+caDWgAbH4Fpx
U4NzRc7fkUWR4yHaxX/AT6nMY86FqlvOKmO/nD4LOBQcIpw9olly7v7dkpWcqb+1w1mPp1PQ+TiZ
znDYnNlh5GEY0dtmaRR6NKqKw4D3qh+W1jSfjS0WYVeESAvsDYHe9pOlxxwh9KSQi0UcC9O05Fd6
3aI7xtG24NXH/WeybWeoR/m9N+uKWvk9XxM2lolZbL0p68705GYIKOfX/qBkrNXoOWqBNWRXUQQG
92EQoUFKGMD8O+HZjkLW2UWWSh3HrgaIa1n2WO8SNnYEYFj/FF2U/hQXGi0VB5AxjkVdidoAtpCo
UNg5l/rVpzWM/wIlYywLUVmWqLNUYNBEvtbMH1pZksAtsDTaGYXLiLWkjcOTbJJdZ+fZJf4n2TQ7
C7+I1l5UN9TUKjT0JRq7IutkPMJolqQhK6n6wdbPSG+yWaT8EekZdjklFW5AuiJf0TPKoHPakUa1
Jzq/pYRzcCvY4q/+cNvCMGo927YFeRmuP5gfINE3XYRWuh+ae3v9orn/Gw/kMbeYLwo95H68XbZO
rttwW6ay668fFzojWKP0vSzxNsFFP4k1Ft+lcqlsqmwSQmqfmtRVVMj0eIbWOJZyePuGFXHrSBiY
y1qpI3dH0COfcydpHT6eV6zz4+JU/D8QlhanzsCKuLPR/ri4qbWx38tMIatu54SP8jtj4GF4C41O
3uoR0n2FhE+H4fzqKwAAAP//AwBQSwMEFAAGAAgAAAAhAJJ9h+AdBwAASSAAABoAAABjbGlwYm9h
cmQvdGhlbWUvdGhlbWUxLnhtbOxZS28bNxC+F+h/WOy9sWS9YiNyYMly3MQvREqKHCmJ2mXMXS5I
yo5uRXLqpUCBtOihAXrroSgaoAEa9NIfY8BBm/6IDrkvUqLiB1wgKGwBxu7sN8PhzOzM7PDO3WcR
9Y4xF4TFbb96q+J7OB6xMYmDtv9osP3Zbd8TEsVjRFmM2/4MC//uxqef3EHrI0qSIUN8PAhxhD0Q
FIt11PZDKZP1lRUxAjISt1iCY3g2YTxCEm55sDLm6AQWiOjKaqXSXIkQif0NkCiVoB6Ff7EUijCi
vK/EYC9GEax+MJmQEdbY8VFVIcRMdCn3jhFt+yBzzE4G+Jn0PYqEhAdtv6L//JWNOytoPWOicgmv
wbet/zK+jGF8tKrX5MGwWLReb9Sbm4V8DaByEddr9Zq9ZiFPA9BoBDtNdbFltla79QxrgNJLh+yt
1latauEN+bUFnTcb6mfhNSiVX1/Ab293wYoWXoNSfGMB3+isdbZs+RqU4psL+FZlc6vesuRrUEhJ
fLSArjSatW6+2wIyYXTHCV9r1Ldbq5nwEgXRUESXWmLCYrks1iL0lPFtACggRZLEnpwleIJGEJNd
RMmQE2+XBCEEXoJiJoBcWa1sV2rwX/3q+kp7FK1jZHArvUATsUBS+nhixEki2/59kOobkLO3b0+f
vzl9/vvpixenz3/N1taiLL4dFAcm3/ufvvnn1Zfe37/9+P7lt+nS83hh4t/98tW7P/78kHjYcWmK
s+9ev3vz+uz7r//6+aVD+iZHQxM+IBEW3j4+8R6yCDbo0B8P+eU4BiEiJsdmHAgUI7WKQ35PhhZ6
f4YocuA62LbjYw6pxgW8N31qKdwP+VQSh8QHYWQB9xijHcadVnig1jLMPJjGgXtxPjVxDxE6dq3d
RbHl5d40gRxLXCK7IbbUPKQolijAMZaeesaOMHbs7gkhll33yIgzwSbSe0K8DiJOkwzI0IqmkmmH
ROCXmUtB8Ldlm73HXodR16638LGNhHcDUYfyA0wtM95DU4kil8gBiqhp8F0kQ5eS/RkfmbiekODp
AFPm9cZYCBfPAYf9Gk5/AGnG7fY9OotsJJfkyCVzFzFmIrfYUTdEUeLC9kkcmtjPxRGEKPIOmXTB
95j9hqh78AOKl7r7McGWu8/PBo8gw5oqlQGinky5w5f3MLPitz+jE4RdqWaTR1aK3eTEGR2daWCF
9i7GFJ2gMcbeo88dGnRYYtm8VPp+CFllB7sC6z6yY1Xdx1hgTzc3i3lylwgrZPs4YEv02ZvNJZ4Z
iiPEl0neB6+bNu9BqYtcAXBAR0cmcJ9Avwfx4jTKgQAZRnAvlXoYIquAqXvhjtcZt/x3kXcM3sun
lhoXeC+BB1+aBxK7yfNB2wwQtRYoA2aAoMtwpVtgsdxfsqjiqtmmTr6J/dKWboDuyGp6IhKf2wHN
9T6N/673gQ7j7IdXjpftevodt2ArWV2y01mWTHbm+ptluPmupsv4mHz8Tc0WmsaHGOrIYsa66Wlu
ehr/f9/TLHufbzqZZf3GTSfjQ4dx08lkw5Xr6WTK5gX6GjXwSAc9euwTLZ36TAilfTmjeFfowY+A
75nxNhAVn55u4mIKmIRwqcocLGDhAo40j8eZ/ILIsB+iBKZDVV8JCUQmOhBewgQMjTTZKVvh6TTa
Y+N02FmtqsFmWlkFkiW90ijoMKiSKbrZKgd4hXitbaAHrbkCivcyShiL2UrUHEq0cqIykh7rgtEc
SuidXYsWaw4tbivxuasWtADVCq/AB7cHn+ltv1EHFmCCeRw052Plp9TVuXe1M6/T08uMaUUANNh5
BJSeXlO6Lt2e2l0aahfwtKWEEW62EtoyusETIXwGZ9GpqBdR47K+XitdaqmnTKHXg9Aq1Wjd/pAW
V/U18M3nBhqbmYLG3knbb9YaEDIjlLT9CQyN4TJKIHaE+uZCNIDjlpHk6Qt/lcyScCG3kAhTg+uk
k2aDiEjMPUqitq+2X7iBxjqHaN2qq5AQPlrl1iCtfGzKgdNtJ+PJBI+k6XaDoiyd3kKGT3OF86lm
vzpYcbIpuLsfjk+8IZ3yhwhCrNGqKgOOiYCzg2pqzTGBw7AikZXxN1eYsrRrnkbpGErpiCYhyiqK
mcxTuE7lhTr6rrCBcZftGQxqmCQrhMNAFVjTqFY1LapGqsPSqns+k7KckTTLmmllFVU13VnMWiEv
A3O2vFqRN7TKTQw5zazwaeqeT7lrea6b6xOKKgEGL+znqLoXKAiGauVilmpK48U0rHJ2RrVrR77B
c1S7SJEwsn4zFztnt6JGOJcD4pUqP/DNRy2QJnlfqS3tOtjeQ4k3DKptHw6XYTj4DK7geNoH2qqi
rSoaXMGZM5SL9KC47WcXOQWep5QCU8sptRxTzyn1nNLIKY2c0swpTd/TJ6pwiq8OU30vPzCFGpYd
sGa9hX36v/EvAAAA//8DAFBLAwQUAAYACAAAACEAnGZGQbsAAAAkAQAAKgAAAGNsaXBib2FyZC9k
cmF3aW5ncy9fcmVscy9kcmF3aW5nMS54bWwucmVsc4SPzQrCMBCE74LvEPZu0noQkSa9iNCr1AcI
yTYtNj8kUezbG+hFQfCyMLPsN7NN+7IzeWJMk3ccaloBQae8npzhcOsvuyOQlKXTcvYOOSyYoBXb
TXPFWeZylMYpJFIoLnEYcw4nxpIa0cpEfUBXNoOPVuYio2FBqrs0yPZVdWDxkwHii0k6zSF2ugbS
L6Ek/2f7YZgUnr16WHT5RwTLpRcWoIwGMwdKV2edNS1dgYmGff0m3gAAAP//AwBQSwECLQAUAAYA
CAAAACEAu+VIlAUBAAAeAgAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBL
AQItABQABgAIAAAAIQCtMD/xwQAAADIBAAALAAAAAAAAAAAAAAAAADYBAABfcmVscy8ucmVsc1BL
AQItABQABgAIAAAAIQDxytw7gQMAANoIAAAfAAAAAAAAAAAAAAAAACACAABjbGlwYm9hcmQvZHJh
d2luZ3MvZHJhd2luZzEueG1sUEsBAi0AFAAGAAgAAAAhAJJ9h+AdBwAASSAAABoAAAAAAAAAAAAA
AAAA3gUAAGNsaXBib2FyZC90aGVtZS90aGVtZTEueG1sUEsBAi0AFAAGAAgAAAAhAJxmRkG7AAAA
JAEAACoAAAAAAAAAAAAAAAAAMw0AAGNsaXBib2FyZC9kcmF3aW5ncy9fcmVscy9kcmF3aW5nMS54
bWwucmVsc1BLBQYAAAAABQAFAGcBAAA2DgAAAAA=
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span lang=EN-US style='font-family:Consolas'>$sudo apt
    update<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:rect><!\[endif]--><!--\[if !vml]-->![Text Box: $sudo apt update](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image001.png)<!--\[endif]-->Make sure your system’s package index is up to date. Refresh the package index with the following command:

 

 

<!--\[if !supportLists]-->2.      <!--\[endif]--><!--\[if gte vml 1]><v:rect id="Rectangle_x0020_2"
 o:spid="_x0000_s1031" style='position:absolute;left:0;text-align:left;
 margin-left:2pt;margin-top:20.1pt;width:446.65pt;height:21.35pt;text-indent:0;
 z-index:251660288;visibility:visible;mso-wrap-style:square;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;v-text-anchor:middle' o:gfxdata="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
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span lang=EN-US style='font-family:Consolas'>$sudo apt
    install ansible<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:rect><!\[endif]--><!--\[if !vml]-->![Text Box: $sudo apt install ansible](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image002.png)<!--\[endif]-->Next, install Ansible on Ubuntu with the command:

 

The installation will prompt you to press **Y** to confirm, with the rest of the installation process being automated.

<!--\[if !supportLists]-->3.      <!--\[endif]--><!--\[if gte vml 1]><v:rect id="Rectangle_x0020_3"
 o:spid="_x0000_s1030" style='position:absolute;left:0;text-align:left;
 margin-left:2pt;margin-top:16.8pt;width:446.65pt;height:22pt;text-indent:0;
 z-index:251661312;visibility:visible;mso-wrap-style:square;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;v-text-anchor:middle' o:gfxdata="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
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span lang=EN-US style='font-family:Consolas'>$ansible
    --version<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:rect><!\[endif]--><!--\[if !vml]-->![Text Box: $ansible --version](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image003.png)<!--\[endif]-->Check the version of Ansible by using the following command:

 

For other operating systems, please refer to the official Ansible documentation.



**Installing the HPE GreenLake Data Services Python SDK**

These Ansible playbooks use the Python libraries of the HPE GreenLake Python SDK. Install the SDK using this command:

<!--\[if gte vml 1]><v:rect id="Rectangle_x0020_9" o:spid="_x0000_s1029"
 style='position:absolute;margin-left:-1.35pt;margin-top:4.05pt;width:526.65pt;
 height:40.65pt;z-index:251665408;visibility:visible;mso-wrap-style:square;
 mso-width-percent:0;mso-height-percent:0;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:middle'
 o:gfxdata="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
dWDxkwHii0k6zSF2ugbSL6Ek/2f7YZgUnr16WHT5RwTLpRcWoIwGMwdKV2edNS1dgYmGff0m3gAA
AP//AwBQSwECLQAUAAYACAAAACEAu+VIlAUBAAAeAgAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRl
bnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAAIQCtMD/xwQAAADIBAAALAAAAAAAAAAAAAAAAADYB
AABfcmVscy8ucmVsc1BLAQItABQABgAIAAAAIQD9s70hyQMAAFMJAAAfAAAAAAAAAAAAAAAAACAC
AABjbGlwYm9hcmQvZHJhd2luZ3MvZHJhd2luZzEueG1sUEsBAi0AFAAGAAgAAAAhAJJ9h+AdBwAA
SSAAABoAAAAAAAAAAAAAAAAAJgYAAGNsaXBib2FyZC90aGVtZS90aGVtZTEueG1sUEsBAi0AFAAG
AAgAAAAhAJxmRkG7AAAAJAEAACoAAAAAAAAAAAAAAAAAew0AAGNsaXBib2FyZC9kcmF3aW5ncy9f
cmVscy9kcmF3aW5nMS54bWwucmVsc1BLBQYAAAAABQAFAGcBAAB+DgAAAAA=
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
    107%;font-family:Consolas;color:red'>$pip install git@github.hpe.com:sijeesh-kattumunda/greenlake_data_services_python.git<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:rect><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                                                 |
|     | ![Text Box: $pip install git@github.hpe.com:sijeesh-kattumunda/greenlake_data_services_python.git](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image004.png) |

<!--\[endif]-->

 







**Cloning the DSCC GitHub repo**                            

<!--\[if gte vml 1]><v:rect id="Rectangle_x0020_4" o:spid="_x0000_s1028"
 style='position:absolute;margin-left:-2pt;margin-top:19.2pt;width:498.65pt;
 height:35.35pt;z-index:251662336;visibility:visible;mso-wrap-style:square;
 mso-width-percent:0;mso-height-percent:0;mso-wrap-distance-left:9pt;
 mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;
 mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:middle'
 o:gfxdata="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
BgAAAAAFAAUAZwEAAJ4OAAAAAA==
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span lang=EN-US style='font-size:10.0pt;line-height:
    107%;font-family:Consolas;color:red'>$</span><span lang=EN-US
    style='font-size:10.0pt;line-height:107%;font-family:Consolas;mso-bidi-font-family:
    "Lucida Console";color:red'>git clone
    git@github.hpe.com:sijeesh-kattumunda/greenlake-data-services-ansible.git</span><span
    lang=EN-US style='font-size:10.0pt;line-height:107%;font-family:Consolas;
    color:red'><o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:rect><!\[endif]--><!--\[if !vml]-->![Text Box: $git clone git@github.hpe.com:sijeesh-kattumunda/greenlake-data-services-ansible.git](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image005.png)<!--\[endif]-->To clone the repo, execute the following command on the machine where you installed Ansible:

 

 

This repo mainly consists of two folders:

<!--\[if !supportLists]-->1.      <!--\[endif]-->**Libraries**: These are Python libraries that will be used by the Ansible playbooks to perform CRUD operations on DSCC resources.

<!--\[if !supportLists]-->2.      <!--\[endif]-->**Examples**: This folder consists of sample Ansible playbooks that perform CRUD operations on DSCC resources. With these examples, one can start building use cases.

**Setting up environment variables**

ANSIBLE_LIBRARY and ANSIBLE_MODULE_UTILS are environment variables that need to be set.

Set the ANISBLE_LIBRARY variable to the *greenlake-data-services-ansible/library* directory of the repo like this.

ANSIBLE_LIBRARY=/home/admin/greenlake-data-services-ansible/library

Set the ANSIBLE_MODULE_UTILS to the module_utils directory under *greenlake-data-services-ansible/library* directory like this.

ANSIBLE_MODULE_UTILS=/home/admin/greenlake-data-services-ansible/library/module_utils

 

**Usage**

Let’s have a look at an example used to perform DSCC operations on a host using an Ansible playbook. For any Ansible playbook to be used, an inventory file is required. The Ansible inventory file defines the hosts and groups of hosts on which commands, modules, and tasks in a playbook operate. In this example, we are calling REST APIs from our local machine. This file can be placed anywhere and the path of this file can be given during the Ansible playbook execution. Create an inventory file, name it “hosts” (the name of the file can be anything), and update it with the following details:

\[localhost]\
127.0.0.1 ansible_connection=local ansible_python_interpreter=/home/admin/ansible-env/bin/python

The IP address given is localhost, which means operations are performed on the local host. Provide the Python interpreter location on your system. Name this file “hosts”.

 

Let's look at a sample of the host file.

Ansible playbooks contain a list/array of tasks that will be performed sequentially. The below code snippet has the following tasks.

<!--\[if !supportLists]-->1.      <!--\[endif]-->Creation of host

<!--\[if !supportLists]-->2.      <!--\[endif]-->Update a host

<!--\[if !supportLists]-->3.      <!--\[endif]-->Delete a host

**Create a host**: In this block, the input request parameters are provided under the section ‘data’. In this sample, only required fields for the REST API call are provided such as name, initiator_ids, user_created flag, and operating system.

**Update a host**: In an update request, one can update the name, and change the initiators. These input parameters can be provided under the ‘data’ section.

**Delete a host**: To delete a host, all you need to provide is the name of the host.

 

 

<!--\[if gte vml 1]><v:shapetype id="_x0000_t75"
 coordsize="21600,21600" o:spt="75" o:preferrelative="t" path="m@4@5l@4@11@9@11@9@5xe"
 filled="f" stroked="f">
 <v:stroke joinstyle="miter"/>
 <v:formulas>
  <v:f eqn="if lineDrawn pixelLineWidth 0"/>
  <v:f eqn="sum @0 1 0"/>
  <v:f eqn="sum 0 0 @1"/>
  <v:f eqn="prod @2 1 2"/>
  <v:f eqn="prod @3 21600 pixelWidth"/>
  <v:f eqn="prod @3 21600 pixelHeight"/>
  <v:f eqn="sum @0 0 1"/>
  <v:f eqn="prod @6 1 2"/>
  <v:f eqn="prod @7 21600 pixelWidth"/>
  <v:f eqn="sum @8 21600 0"/>
  <v:f eqn="prod @7 21600 pixelHeight"/>
  <v:f eqn="sum @10 21600 0"/>
 </v:formulas>
 <v:path o:extrusionok="f" gradientshapeok="t" o:connecttype="rect"/>
 <o:lock v:ext="edit" aspectratio="t"/>
</v:shapetype><v:shape id="_x0000_i1025" type="#_x0000_t75" style='width:468pt;
 height:604.8pt' o:ole="">
 <v:imagedata src="file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image006.emz"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image007.png)<!--\[endif]--><!--\[if gte mso 9]><xml>
 <o:OLEObject Type="Embed" ProgID="Word.OpenDocumentText.12"
  ShapeID="_x0000_i1025" DrawAspect="Content" ObjectID="_1741191492">
 </o:OLEObject>
</xml><!\[endif]-->

 

To execute the Ansible playbook, execute the following command:

<!--\[if gte vml 1]><v:rect id="Rectangle_x0020_7" o:spid="_x0000_s1027"
 style='position:absolute;margin-left:2pt;margin-top:1.8pt;width:450pt;
 height:24pt;z-index:251663360;visibility:visible;mso-wrap-style:square;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;v-text-anchor:middle' o:gfxdata="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
AQAAWw4AAAAA
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span lang=EN-US style='font-family:"Lucida Console"'>$ansible-playbook
    examples/greenlake_host.yaml --i ../hosts<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:rect><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                       |
|     | ![Text Box: $ansible-playbook examples/greenlake_host.yaml --i ../hosts](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image008.png) |

<!--\[endif]-->

 

 



This is what the result of a playbook execution looks like.

<!--\[if gte vml 1]><v:shape
 id="_x0000_i1026" type="#_x0000_t75" style='width:468pt;height:641.4pt' o:ole="">
 <v:imagedata src="file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image009.emz"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image010.png)<!--\[endif]--><!--\[if gte mso 9]><xml>
 <o:OLEObject Type="Embed" ProgID="Word.OpenDocumentText.12"
  ShapeID="_x0000_i1026" DrawAspect="Content" ObjectID="_1741191493">
 </o:OLEObject>
</xml><!\[endif]-->

These Ansible playbooks can be used to fetch details as well. Under the examples folder, there are files with the suffix ‘_facts’ which specify that it is used to get the details of a resource.

For example, take a look at the ‘greenlake_host_facts.yaml’.  This playbook is used to get the details of the host.

<!--\[if gte vml 1]><v:shape
 id="_x0000_i1027" type="#_x0000_t75" style='width:468pt;height:250.8pt' o:ole="">
 <v:imagedata src="file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image011.emz"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image012.png)<!--\[endif]--><!--\[if gte mso 9]><xml>
 <o:OLEObject Type="Embed" ProgID="Word.OpenDocumentText.12"
  ShapeID="_x0000_i1027" DrawAspect="Content" ObjectID="_1741191494">
 </o:OLEObject>
</xml><!\[endif]-->

In this playbook, you have an option to add filters to it like ID, limit, offset, etc., or else you can get the details of all hosts available.

Use the following command to execute the ansible playbook:

<!--\[if gte vml 1]><v:rect id="Rectangle_x0020_8" o:spid="_x0000_s1026"
 style='position:absolute;margin-left:0;margin-top:-.05pt;width:450pt;height:24pt;
 z-index:251664384;visibility:visible;mso-wrap-style:square;
 mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;
 mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;
 mso-position-horizontal-relative:text;mso-position-vertical:absolute;
 mso-position-vertical-relative:text;v-text-anchor:middle' o:gfxdata="UEsDBBQABgAIAAAAIQC75UiUBQEAAB4CAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbKSRvU7DMBSF
dyTewfKKEqcMCKEmHfgZgaE8wMW+SSwc27JvS/v23KTJgkoXFsu+P+c7Ol5vDoMTe0zZBl/LVVlJ
gV4HY31Xy4/tS3EvRSbwBlzwWMsjZrlprq/W22PELHjb51r2RPFBqax7HCCXIaLnThvSAMTP1KkI
+gs6VLdVdad08ISeCho1ZLN+whZ2jsTzgcsnJwldluLxNDiyagkxOquB2Knae/OLUsyEkjenmdzb
mG/YhlRnCWPnb8C898bRJGtQvEOiVxjYhtLOxs8AySiT4JuDystlVV4WPeM6tK3VaILeDZxIOSsu
ti/jidNGNZ3/J08yC1dNv9v8AAAA//8DAFBLAwQUAAYACAAAACEArTA/8cEAAAAyAQAACwAAAF9y
ZWxzLy5yZWxzhI/NCsIwEITvgu8Q9m7TehCRpr2I4FX0AdZk2wbbJGTj39ubi6AgeJtl2G9m6vYx
jeJGka13CqqiBEFOe2Ndr+B03C3WIDihMzh6RwqexNA281l9oBFTfuLBBhaZ4ljBkFLYSMl6oAm5
8IFcdjofJ0z5jL0MqC/Yk1yW5UrGTwY0X0yxNwri3lQgjs+Qk/+zfddZTVuvrxO59CNCmoj3vCwj
MfaUFOjRhrPHaN4Wv0VV5OYgm1p+LW1eAAAA//8DAFBLAwQUAAYACAAAACEAQHAleakDAAARCQAA
HwAAAGNsaXBib2FyZC9kcmF3aW5ncy9kcmF3aW5nMS54bWzUVlFv2zYQfh+w/0AQe3UkO3aTGFUK
x1uCAUYbxC36WJwpyhJCkRpJO3Z/fT9SkuO4WR62vQxBEpJ3/Pjdd3ek3n/Y1YptpXWV0RkfnqWc
SS1MXul1xr98vh1ccuY86ZyU0TLje+n4h+tff3lP07WlpqwEA4J2U8p46X0zTRInSlmTOzON1LAV
xtbkMbXrJLf0BORaJaM0fZfUVGl+/Qz1O3liG1v9AyhlxKPM56S35ACpxPR4peOoxL9Hpqne3tlm
2dzbwFx83N5bVuUZh3KaakjEk87QuWGanOxaPwPsClsHf1MUbJfxq+F4nAJqn/HJVXqZjtMWTu48
E7BPLoaTNDgIeJyn40uM2/PKT28jiPKPtzFAsiWDwRFB1wR6evtzxCiNNuIHKVAiayXZ5SH44N5H
3m91nWj/TcwHvjRtrPN30tQsDDJuwSfWFW0XzrcsepeYjJ6I3y1jdH53Y/J9iHOF/0ioNYCByq4R
txUwF+T8PVkUORbRLv4T/hTKPGVcqKrhrDT2++la8EPBwcLZE5ol4+6vDVnJmfpTuy7XnPk4GU8u
RsC2x5bVsUVv6rlR6NHIKg6Dv1f9sLCm/mpsPgunwkRa4GwQ9LafzD3mMKEnhZzN4liYuiG/0MsG
3TGMsgWtPu++km06QT3K76NZltTI13RtfWOZmNnGm6LqRG/VDAbl/NLvlYy1GjVHLbCa7CKSwOAh
DKJroBIGEP9eeLalEHV6Ecq+zaU68riRRe/rXevbu2H/s3VW+FO/rndQR/CMdgy7ErXB2YKiQmFn
XOrBlyWE/w4mQ/AIVlkUqLO2wBAg+Uozv29kQQK3wGIjqpzY3GhnFFLekDYO6+kovUnfpVfo7Al+
R/gZw1p5Ud5SXSm09fgK7V2SdTImMkom6Qh7Tqpa2eoF6C3gAhjg0vNXQM9xyimocEegC/IlvYAM
PFuGHfAJz58hoR80C+L4699Iu2ql5KBRtF8Z88jkjupGSZesrZRa0aP8Vhrnv0EwvA97wks0GFTs
7CwJyy7cmshZwIxy6zx04MNxTu5u3szJ/0Y0eYgtxov+CLEfLqWNk8smXLJt+fe3lgsNFaRR+kEW
eITwPoxiacYnWM6VbRuChJDat73tSspluxwekkOvhEc77IhHR8CAXFRKHbA7gN7zJXZLrfOP+Yrt
cdjc9szfEGs3tw2FHfFko/1hc11pY1+LTCGq7uTWP9LvhIGG4fFKTj4Gokv38RK+OI7n1z8AAAD/
/wMAUEsDBBQABgAIAAAAIQCSfYfgHQcAAEkgAAAaAAAAY2xpcGJvYXJkL3RoZW1lL3RoZW1lMS54
bWzsWUtvGzcQvhfof1jsvbFkvWIjcmDJctzEL0RKihwpidplzF0uSMqObkVy6qVAgbTooQF666Eo
GqABGvTSH2PAQZv+iA65L1Ki4gdcIChsAcbu7DfD4czszOzwzt1nEfWOMReExW2/eqviezgesTGJ
g7b/aLD92W3fExLFY0RZjNv+DAv/7sann9xB6yNKkiFDfDwIcYQ9EBSLddT2QymT9ZUVMQIyErdY
gmN4NmE8QhJuebAy5ugEFojoymql0lyJEIn9DZAolaAehX+xFIoworyvxGAvRhGsfjCZkBHW2PFR
VSHETHQp944Rbfsgc8xOBviZ9D2KhIQHbb+i//yVjTsraD1jonIJr8G3rf8yvoxhfLSq1+TBsFi0
Xm/Um5uFfA2gchHXa/WavWYhTwPQaAQ7TXWxZbZWu/UMa4DSS4fsrdZWrWrhDfm1BZ03G+pn4TUo
lV9fwG9vd8GKFl6DUnxjAd/orHW2bPkalOKbC/hWZXOr3rLka1BISXy0gK40mrVuvtsCMmF0xwlf
a9S3W6uZ8BIF0VBEl1piwmK5LNYi9JTxbQAoIEWSxJ6cJXiCRhCTXUTJkBNvlwQhBF6CYiaAXFmt
bFdq8F/96vpKexStY2RwK71AE7FAUvp4YsRJItv+fZDqG5Czt29Pn785ff776YsXp89/zdbWoiy+
HRQHJt/7n77559WX3t+//fj+5bfp0vN4YeLf/fLVuz/+/JB42HFpirPvXr978/rs+6//+vmlQ/om
R0MTPiARFt4+PvEesgg26NAfD/nlOAYhIibHZhwIFCO1ikN+T4YWen+GKHLgOti242MOqcYFvDd9
aincD/lUEofEB2FkAfcYox3GnVZ4oNYyzDyYxoF7cT41cQ8ROnat3UWx5eXeNIEcS1wiuyG21Dyk
KJYowDGWnnrGjjB27O4JIZZd98iIM8Em0ntCvA4iTpMMyNCKppJph0Tgl5lLQfC3ZZu9x16HUdeu
t/CxjYR3A1GH8gNMLTPeQ1OJIpfIAYqoafBdJEOXkv0ZH5m4npDg6QBT5vXGWAgXzwGH/RpOfwBp
xu32PTqLbCSX5MglcxcxZiK32FE3RFHiwvZJHJrYz8URhCjyDpl0wfeY/Yaoe/ADipe6+zHBlrvP
zwaPIMOaKpUBop5MucOX9zCz4rc/oxOEXalmk0dWit3kxBkdnWlghfYuxhSdoDHG3qPPHRp0WGLZ
vFT6fghZZQe7Aus+smNV3cdYYE83N4t5cpcIK2T7OGBL9NmbzSWeGYojxJdJ3gevmzbvQamLXAFw
QEdHJnCfQL8H8eI0yoEAGUZwL5V6GCKrgKl74Y7XGbf8d5F3DN7Lp5YaF3gvgQdfmgcSu8nzQdsM
ELUWKANmgKDLcKVbYLHcX7Ko4qrZpk6+if3Slm6A7shqeiISn9sBzfU+jf+u94EO4+yHV46X7Xr6
HbdgK1ldstNZlkx25vqbZbj5rqbL+Jh8/E3NFprGhxjqyGLGuulpbnoa/3/f0yx7n286mWX9xk0n
40OHcdPJZMOV6+lkyuYF+ho18EgHPXrsEy2d+kwIpX05o3hX6MGPgO+Z8TYQFZ+ebuJiCpiEcKnK
HCxg4QKONI/HmfyCyLAfogSmQ1VfCQlEJjoQXsIEDI002Slb4ek02mPjdNhZrarBZlpZBZIlvdIo
6DCokim62SoHeIV4rW2gB625Aor3MkoYi9lK1BxKtHKiMpIe64LRHEronV2LFmsOLW4r8bmrFrQA
1QqvwAe3B5/pbb9RBxZggnkcNOdj5afU1bl3tTOv09PLjGlFADTYeQSUnl5Tui7dntpdGmoX8LSl
hBFuthLaMrrBEyF8BmfRqagXUeOyvl4rXWqpp0yh14PQKtVo3f6QFlf1NfDN5wYam5mCxt5J22/W
GhAyI5S0/QkMjeEySiB2hPrmQjSA45aR5OkLf5XMknAht5AIU4PrpJNmg4hIzD1Koravtl+4gcY6
h2jdqquQED5a5dYgrXxsyoHTbSfjyQSPpOl2g6Isnd5Chk9zhfOpZr86WHGyKbi7H45PvCGd8ocI
QqzRqioDjomAs4Nqas0xgcOwIpGV8TdXmLK0a55G6RhK6YgmIcoqipnMU7hO5YU6+q6wgXGX7RkM
apgkK4TDQBVY06hWNS2qRqrD0qp7PpOynJE0y5ppZRVVNd1ZzFohLwNztrxakTe0yk0MOc2s8Gnq
nk+5a3mum+sTiioBBi/s56i6FygIhmrlYpZqSuPFNKxydka1a0e+wXNUu0iRMLJ+Mxc7Z7eiRjiX
A+KVKj/wzUctkCZ5X6kt7TrY3kOJNwyqbR8Ol2E4+Ayu4HjaB9qqoq0qGlzBmTOUi/SguO1nFzkF
nqeUAlPLKbUcU88p9ZzSyCmNnNLMKU3f0yeqcIqvDlN9Lz8whRqWHbBmvYV9+r/xLwAAAP//AwBQ
SwMEFAAGAAgAAAAhAJxmRkG7AAAAJAEAACoAAABjbGlwYm9hcmQvZHJhd2luZ3MvX3JlbHMvZHJh
d2luZzEueG1sLnJlbHOEj80KwjAQhO+C7xD2btJ6EJEmvYjQq9QHCMk2LTY/JFHs2xvoRUHwsjCz
7DezTfuyM3liTJN3HGpaAUGnvJ6c4XDrL7sjkJSl03L2DjksmKAV201zxVnmcpTGKSRSKC5xGHMO
J8aSGtHKRH1AVzaDj1bmIqNhQaq7NMj2VXVg8ZMB4otJOs0hdroG0i+hJP9n+2GYFJ69elh0+UcE
y6UXFqCMBjMHSldnnTUtXYGJhn39Jt4AAAD//wMAUEsBAi0AFAAGAAgAAAAhALvlSJQFAQAAHgIA
ABMAAAAAAAAAAAAAAAAAAAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECLQAUAAYACAAAACEArTA/
8cEAAAAyAQAACwAAAAAAAAAAAAAAAAA2AQAAX3JlbHMvLnJlbHNQSwECLQAUAAYACAAAACEAQHAl
eakDAAARCQAAHwAAAAAAAAAAAAAAAAAgAgAAY2xpcGJvYXJkL2RyYXdpbmdzL2RyYXdpbmcxLnht
bFBLAQItABQABgAIAAAAIQCSfYfgHQcAAEkgAAAaAAAAAAAAAAAAAAAAAAYGAABjbGlwYm9hcmQv
dGhlbWUvdGhlbWUxLnhtbFBLAQItABQABgAIAAAAIQCcZkZBuwAAACQBAAAqAAAAAAAAAAAAAAAA
AFsNAABjbGlwYm9hcmQvZHJhd2luZ3MvX3JlbHMvZHJhd2luZzEueG1sLnJlbHNQSwUGAAAAAAUA
BQBnAQAAXg4AAAAA
" fillcolor="#4472c4 \[3204]" strokecolor="#1f3763 \[1604]" strokeweight="1pt">
 <v:textbox>
  <!\[if !mso]>
  <table cellpadding=0 cellspacing=0 width="100%">
   <tr>
    <td><!\[endif]>
    <div>
    <p class=MsoNormal><span lang=EN-US style='font-family:"Lucida Console"'>$ansible-playbook
    examples/greenlake_host_facts.yaml --i ../hosts<o:p></o:p></span></p>
    </div>
    <!\[if !mso]></td>
   </tr>
  </table>
  <!\[endif]></v:textbox>
</v:rect><!\[endif]--><!--\[if !vml]-->

|     |                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     |                                                                                                                                                             |
|     | ![Text Box: $ansible-playbook examples/greenlake_host_facts.yaml --i ../hosts](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image013.png) |

<!--\[endif]-->

 

 



The output looks like this:

<!--\[if gte vml 1]><v:shape
 id="_x0000_i1028" type="#_x0000_t75" style='width:468pt;height:641.4pt' o:ole="">
 <v:imagedata src="file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image014.emz"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:/Users/emmad/AppData/Local/Temp/msohtmlclip1/01/clip_image015.png)<!--\[endif]--><!--\[if gte mso 9]><xml>
 <o:OLEObject Type="Embed" ProgID="Word.OpenDocumentText.12"
  ShapeID="_x0000_i1028" DrawAspect="Content" ObjectID="_1741191495">
 </o:OLEObject>
</xml><!\[endif]-->

In the current release, only critical resources are supported. New resources will be added moving forward. This is just the beginning.  In the future, there are many use cases to cover.

<!--EndFragment--\