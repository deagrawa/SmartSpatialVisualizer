/**
 * 
 */
package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.naming.NamingException;
import org.odata4j.core.OEntities;
import org.odata4j.core.OEntity;
import org.odata4j.core.OEntityKey;
import org.odata4j.core.OLink;
import org.odata4j.core.OProperties;
import org.odata4j.core.OProperty;
import org.odata4j.edm.EdmEntitySet;
import org.odata4j.edm.EdmProperty;
import org.odata4j.edm.EdmType;
import org.odata4j.edm.EdmSimpleType;
import org.odata4j.expression.AndExpression;
import org.odata4j.expression.BinaryBoolCommonExpression;
import org.odata4j.expression.BinaryCommonExpression;
import org.odata4j.expression.BoolCommonExpression;
import org.odata4j.expression.BoolMethodExpression;
import org.odata4j.expression.BoolParenExpression;
import org.odata4j.expression.CommonExpression;
import org.odata4j.expression.EndsWithMethodCallExpression;
import org.odata4j.expression.EntitySimpleProperty;
import org.odata4j.expression.EqExpression;
import org.odata4j.expression.Expression;
import org.odata4j.expression.GtExpression;
import org.odata4j.expression.LiteralExpression;
import org.odata4j.expression.LtExpression;
import org.odata4j.expression.NeExpression;
import org.odata4j.expression.OrExpression;
import org.odata4j.expression.OrderByExpression;
import org.odata4j.expression.StartsWithMethodCallExpression;
import org.odata4j.expression.SubstringOfMethodCallExpression;
import org.odata4j.expression.ToUpperMethodCallExpression;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Jdbc operation assistant class, deal with some common CRUD
 * 
 * @since Jun 13, 2011
 */
public class JdbcOperator
{

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(JdbcOperator.class);

	/**
	 * Member variables which will be read from properties files
	 */
	private Map<String, String> propertiesMap;
	private String tablePattern;

	JdbcOperator()
	{
		// Read properties
		propertiesMap= OdataUtility.getPropertiesMap();
		tablePattern= propertiesMap.get("tablePattern");
	}

	
	/**
	 * listTables method used to list all the table name belong to the given database, and pattern by the config file.
	 * 
	 * @param connection
	 *            Database connection
	 * @param dataBase
	 *            dataBase name
	 * @return
	 *			  Return list all tables.
	 */
	public ArrayList<String> listTables(Connection connection, String dataBase)
	{
		ArrayList<String> list= new ArrayList<String>();
		ArrayList<String> tableList= new ArrayList<String>();
		String tablePatternName[]= tablePattern.split(",");

		for(int i= 0; i < tablePatternName.length; ++i)
		{
			tableList.add(tablePatternName[i]);
		}
		try
		{
			ResultSet res= connection.getMetaData().getTables(null, dataBase, null, new String[] {"TABLE"});
			while(res.next())
			{
				String tb= res.getString("TABLE_NAME");
				if(tableList.contains(tb))
				{
					list.add(tb);
				}
			}
			res.close();
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		return list;
	}

	
	/**
	 * getColumnOdatas method used to get table columns info, populate to odata Edm property.
	 * 
	 * @param connection
	 *            Database connection
	 * @param dataBase
	 *            dataBase name
	 * @param table
	 *            Database table name
	 * @return
	 *			  Return list all columns name of a table.
	 */
	public ArrayList<EdmProperty.Builder> getColumnOdatas(Connection connection, String dataBase, String table)
	{
		ArrayList<EdmProperty.Builder> properties= new ArrayList<EdmProperty.Builder>();
		try
		{
			ResultSet res= connection.getMetaData().getColumns(dataBase, dataBase, table, "%");
			while(res.next())
			{
				String name= res.getString("COLUMN_NAME");
				EdmType type= EdmSimpleType.STRING;
				boolean isNull= (res.getInt("NULLABLE") == 0) ? false : true;
				EdmProperty.Builder ep= EdmProperty.newBuilder(name).setType(type).setNullable(isNull);
				properties.add(ep);
			}
			res.close();
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		return properties;
	}

	/**
	 * getIndexColumn method used to get specific db-table's index column name.
	 * 
	 * @param connection
	 *            Database connection
	 * @param dataBase
	 *            dataBase name
	 * @param table
	 *            Database table name
	 * @return
	 *			  Return list all index name of a table.
	 */
	public List<String> getIndexColumn(Connection connection, String dataBase, String table)
	{
		//String[] primaryKeys;
		List<String>primaryKeys = new ArrayList<String> ();
		String idx= null;
		ResultSet res= null;
		try
		{
			// ResultSet res = connection.getMetaData().getIndexInfo(null,dataBase, table, false,
			// true);
			res= connection.getMetaData().getPrimaryKeys(null, dataBase, table);
			while(res.next())
			{
				idx = res.getString("COLUMN_NAME");
				primaryKeys.add(idx);
			}			
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally {
			OdataUtility.safeClose(res);
		}
		return primaryKeys;
	}

	/**
	 * iterate the result set, map to OEntity object
	 * 
	 * @param res
	 *            the jdbc query result
	 * @param ees
	 *            the Odata metadata, which contain data type
	 * @return the table rows
	 */
	public List<OEntity> resultToEntities(ResultSet res, EdmEntitySet ees)
	{
		List<OEntity> list= new ArrayList<OEntity>();
		try
		{
			while(res.next())
			{
				// for each row
				List<OProperty<?>> properties= new ArrayList<OProperty<?>>();
				for(EdmProperty prop : ees.getType().getProperties())
				{
					// for each column
					String value= res.getString(prop.getName());
					properties.add(OProperties.string(prop.getName(), value));
				}
				List<String> primaryKeyArray = ees.getType().getKeys();
				List<OProperty<?>>primaryKeyVal= new ArrayList<OProperty<?>>();
				for (int i= 0; i<primaryKeyArray.size(); ++i) {
					primaryKeyVal.add(properties.get(i));
				}
				
				OEntity en= OEntities.create(ees, OEntityKey.create(primaryKeyVal), properties, new ArrayList<OLink>());
				//OEntity en= OEntities.create(ees, OEntityKey.create(properties.get(0),properties.get(1)), properties, new ArrayList<OLink>());
//				OEntity en= OEntities.create(ees, OEntityKey.infer(ees, properties), properties, new ArrayList<OLink>());
				list.add(en);
			}
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		return list;
	}

	/**
	 * generateFilter method used to generate filter clause sql, like: name='Jim' AND id>2.
	 * 
	 * @param filter
	 *            BoolCommonExpression value.
	 * @return
	 *			  Return sql filter clause.
	 */
	public String generateFilter(BoolCommonExpression filter)
	{

		StringBuffer tail= new StringBuffer();
		// for string
		if(filter instanceof EqExpression)
		{
			
			if ( ((EqExpression)filter).getLHS().toString().equalsIgnoreCase("ToUpperMethodCallExpression")) {
				
				CommonExpression exp = ((EqExpression)filter).getLHS();
				String l= ((EntitySimpleProperty)(((ToUpperMethodCallExpression)exp).getTarget())).getPropertyName();
				String r= Expression.literalValue((LiteralExpression)((BinaryCommonExpression)filter).getRHS()).toString();
				// " leftword='rightword'"
				tail.append(" UPPER(").append(l).append(") = ").append("'").append(r).append("'");				
			}
			else {			
				String l= ((EntitySimpleProperty)((BinaryCommonExpression)filter).getLHS()).getPropertyName();
				String r= Expression.literalValue((LiteralExpression)((BinaryCommonExpression)filter).getRHS()).toString();
				// " leftword='rightword'"
				tail.append(" ").append(l).append("=").append("'").append(r).append("'");
			}
		}
		
		if(filter instanceof NeExpression)
		{
			String l= ((EntitySimpleProperty)((BinaryCommonExpression)filter).getLHS()).getPropertyName();
			String r= Expression.literalValue((LiteralExpression)((BinaryCommonExpression)filter).getRHS()).toString();
			// " leftword='rightword'"
			tail.append(" ").append(l).append("!=").append("'").append(r).append("'");
		}

		if(filter instanceof EndsWithMethodCallExpression)
		{
			String l= ((EntitySimpleProperty)((EndsWithMethodCallExpression)filter).getTarget()).getPropertyName();
			String r= Expression.literalValue((LiteralExpression)((EndsWithMethodCallExpression)filter).getValue()).toString();
			// " leftword like '%rightword'"
			tail.append(" ").append(l).append(" LIKE ").append("'%").append(r).append("'");
		}

		if(filter instanceof StartsWithMethodCallExpression)
		{
			String l= ((EntitySimpleProperty)((StartsWithMethodCallExpression)filter).getTarget()).getPropertyName();
			String r= Expression.literalValue((LiteralExpression)((StartsWithMethodCallExpression)filter).getValue()).toString();
			// " leftword like 'rightword%'"
			tail.append(" ").append(l).append(" LIKE ").append("'").append(r).append("%'");
		}

		if(filter instanceof SubstringOfMethodCallExpression)
		{
			
			if ( ((SubstringOfMethodCallExpression)filter).getTarget().toString().equalsIgnoreCase("ToUpperMethodCallExpression")) {
				CommonExpression exp = ((SubstringOfMethodCallExpression)filter).getTarget();
				String l= ((EntitySimpleProperty)(((ToUpperMethodCallExpression)exp).getTarget())).getPropertyName();
				String r = ((EntitySimpleProperty)((SubstringOfMethodCallExpression)filter).getValue()).getPropertyName();
				// " leftword='rightword'"
				tail.append(" UPPER(").append(l).append(")").append(" LIKE ").append("'%").append(r).append("%'");			
			}
			else {	
				String l= ((EntitySimpleProperty)((SubstringOfMethodCallExpression)filter).getTarget()).getPropertyName();
				String r= Expression.literalValue((LiteralExpression)((SubstringOfMethodCallExpression)filter).getValue()).toString();
				// " leftword like '%rightword%'"
				tail.append(" ").append(l).append(" LIKE ").append("'%").append(r).append("%'");
			}
		}

		// for int
		if(filter instanceof GtExpression)
		{
			String l= ((EntitySimpleProperty)((BinaryCommonExpression)filter).getLHS()).getPropertyName();
			String r= Expression.literalValue((LiteralExpression)((BinaryCommonExpression)filter).getRHS()).toString();
			// " leftword>'rightword'"
			tail.append(" ").append(l).append(">").append("'").append(r).append("'");
		}
		if(filter instanceof LtExpression)
		{
			String l= ((EntitySimpleProperty)((BinaryCommonExpression)filter).getLHS()).getPropertyName();
			String r= Expression.literalValue((LiteralExpression)((BinaryCommonExpression)filter).getRHS()).toString();
			// " leftword<'rightword'"
			tail.append(" ").append(l).append("<").append("'").append(r).append("'");
		}

		if(filter instanceof BoolParenExpression)
		{
			CommonExpression ce= ((BoolParenExpression)filter).getExpression();
			if(ce.toString().equalsIgnoreCase("OrExpression"))
			{
				OrExpression e1= ((OrExpression)((BoolParenExpression)filter).getExpression());
				return String.format("%s OR%s", generateFilter(e1.getLHS()), generateFilter(e1.getRHS()));
			}
			if(ce.toString().equalsIgnoreCase("AndExpression"))
			{
				AndExpression andExpression= ((AndExpression)((BoolParenExpression)filter).getExpression());
				return String.format("%s AND%s", generateFilter(andExpression.getLHS()), generateFilter(andExpression.getRHS()));
			}
		}

		// special
		if(filter instanceof AndExpression)
		{
			AndExpression e= (AndExpression)filter;
			return String.format("%s AND%s", generateFilter(e.getLHS()), generateFilter(e.getRHS()));
		}

		// for OR
		if(filter instanceof OrExpression)
		{
			OrExpression e= (OrExpression)filter;
			return String.format("%s OR%s", generateFilter(e.getLHS()), generateFilter(e.getRHS()));
		}

		return tail.toString();
	}

	/**
	 * generateOrderby method used to generate order by clause sql, like: department desc, id asc.
	 * 
	 * @param orderBy
	 *            List of OrderByExpression.
	 * @return
	 *			  Return sql order by clause.
	 */
	public String generateOrderby(List<OrderByExpression> orderBy)
	{
		StringBuffer tail= new StringBuffer();
		for(OrderByExpression order : orderBy)
		{
			String field= ((EntitySimpleProperty)order.getExpression()).getPropertyName();
			String type;
			if(order.getDirection() == OrderByExpression.Direction.ASCENDING)
				type= "ASC";
			else
				type= "DESC";
			// " field ASC,"
			tail.append(" ").append(field).append(" ").append(type).append(",");
		}
		// remove last comma
		return tail.substring(0, tail.length() - 1);
	}

	/**
	 * getNamesFromEntity method used to get the list of odata entity's column name.
	 * 
	 * @param orderBy
	 *            List of OrderByExpression.
	 * @return
	 *			  Return list of odata entity's column name.
	 */
	public ArrayList<String> getNamesFromEntity(OEntity entity)
	{
		ArrayList<String> retList= new ArrayList<String>();
		for(OProperty<?> prop : entity.getProperties())
		{
			retList.add(prop.getName());
		}
		return retList;
	}

	/**
	 * getNamesFromEntity method used to get the list of odata entity's value.
	 * 
	 * @param entity
	 *            OEntity object.
	 * @return
	 *			  Return list of odata entity's value.
	 */
	public ArrayList<String> getValuesFromEntity(OEntity entity)
	{
		ArrayList<String> retList= new ArrayList<String>();
		for(OProperty<?> prop : entity.getProperties())
		{
			retList.add("'" + prop.getValue().toString() + "'");
		}
		return retList;
	}

	/**
	 * getKeyValueFromEntity method used to get single odata entity's value.
	 * 
	 * @param entity
	 *            OEntity object.
	 * @return
	 *			  Return single odata entity's value.
	 */
	public String getKeyValueFromEntity(OEntity entity, String keyColName)
	{
		String keyVal = "";
		for(OProperty<?> prop : entity.getProperties())
		{
			if (prop.getName().toString().equalsIgnoreCase(keyColName)) {
				keyVal = prop.getValue().toString();
			}
		}
		return keyVal;
	}
	
	/**
	 * Map Error number and message to OEntity object
	 * 
	 * @param errorNumber
	 *            Error Number
	 * @param errorMessage
	 *            Error Message
	 * @param ees
	 *            the Odata metadata, which contain data type
	 * @return the table rows
	 */
	public OEntity errorToEntities(String errorNumber, String errorMessage, EdmEntitySet ees)
	{
		OEntityKey entityKey= OEntityKey.create(ees.getType().getKeys().get(0));
		List<OProperty<?>> properties= new ArrayList<OProperty<?>>();
		properties.add(OProperties.string(errorNumber, errorMessage));
		
		OEntity en= OEntities.create(ees, entityKey, properties, new ArrayList<OLink>());
		
		return en;
	}
}
